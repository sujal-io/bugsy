import mongoose from "mongoose";
import User from "../models/user.model.js";
import Team from "../models/team.model.js";
import dotenv from "dotenv";

dotenv.config();

const migrateToMultiTeams = async () => {
  try {
    console.log("Starting migration to multi-team support...");
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bugsy");
    console.log("Connected to database");

    // Find all users who have a single team reference
    const usersWithSingleTeam = await User.find({ team: { $exists: true, $ne: null } });
    console.log(`Found ${usersWithSingleTeam.length} users with single team reference`);

    for (const user of usersWithSingleTeam) {
      // Add the single team to the teams array
      if (user.team && !user.teams.includes(user.team)) {
        user.teams.push(user.team);
        await user.save();
        console.log(`Migrated user ${user.username} to teams array`);
      }
    }

    // Remove the old team field from all users
    await User.updateMany(
      {},
      { $unset: { team: 1 } }
    );
    console.log("Removed old team field from all users");

    // Verify migration
    const usersWithTeams = await User.find({ teams: { $exists: true, $ne: [] } });
    console.log(`Migration complete. ${usersWithTeams.length} users now have teams array`);

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateToMultiTeams();
