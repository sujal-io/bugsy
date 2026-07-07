
import { useCallback, useEffect, useState } from "react";
import { Camera, Lock, User, Mail, Calendar, Users } from "lucide-react";
import { useToast } from "../components/common/ToastProvider.jsx";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer.jsx";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { apiRequest } from "../lib/apiClient";

function Profile() {
  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(userFromStorage);
  const [loading, setLoading] = useState(true);
  const [savingUsername, setSavingUsername] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalUsername, setOriginalUsername] = useState("");
  const [originalAvatar, setOriginalAvatar] = useState("");
  const [hasUsernameChanges, setHasUsernameChanges] = useState(false);
  const [hasAvatarChanges, setHasAvatarChanges] = useState(false);
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const toast = useToast();

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/api/auth/profile");
      setUser(data);
      setUsername(data.username);
      setOriginalUsername(data.username);
      setAvatarPreview(data.avatar || "");
      setOriginalAvatar(data.avatar || "");
    } catch (error) {
      console.error("Fetch profile error:", error);
      toast.error(error?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Check for changes
  useEffect(() => {
    setHasUsernameChanges(username !== originalUsername);
    setHasAvatarChanges(selectedFile !== null);
  }, [username, originalUsername, selectedFile]);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  // Handle save avatar
  const handleSaveAvatar = async () => {
    try {
      setSavingAvatar(true);
      
      const formData = new FormData();
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const data = await apiRequest("/api/auth/profile", {
        method: "PUT",
        body: formData,
      });

      // Update local storage
      const updatedUser = {
        ...userFromStorage,
        avatar: data.avatar,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(data);
      setOriginalAvatar(data.avatar || "");
      setSelectedFile(null);
      
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Save avatar error:", error);
      toast.error(error?.message || "Failed to update profile picture");
    } finally {
      setSavingAvatar(false);
    }
  };

  // Handle save username
  const handleSaveUsername = async () => {
    try {
      setSavingUsername(true);
      
      const formData = new FormData();
      if (username !== originalUsername) {
        formData.append("username", username);
      }

      const data = await apiRequest("/api/auth/profile", {
        method: "PUT",
        body: formData,
      });

      // Update local storage
      const updatedUser = {
        ...userFromStorage,
        username: data.username,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(data);
      setOriginalUsername(data.username);
      
      toast.success("Username updated successfully!");
    } catch (error) {
      console.error("Save username error:", error);
      toast.error(error?.message || "Failed to update username");
    } finally {
      setSavingUsername(false);
    }
  };

  // Handle cancel avatar
  const handleCancelAvatar = () => {
    setAvatarPreview(originalAvatar);
    setSelectedFile(null);
  };

  // Handle cancel username
  const handleCancelUsername = () => {
    setUsername(originalUsername);
  };

  // Handle change password
  const handleChangePassword = async () => {
    // Validation
    setPasswordError("");
    
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    try {
      setChangingPassword(true);
      await apiRequest("/api/auth/change-password", {
        method: "PUT",
        body: {
          currentPassword,
          newPassword,
        },
      });

      // Reset fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Change password error:", error);
      setPasswordError(error?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-content-primary">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen flex-col">
        <Navbar title="Profile" showLogo />

        <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-4xl w-full mx-auto">
          {/* Profile Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="h-28 w-28 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="h-28 w-28 rounded-full bg-primary-muted flex items-center justify-center border-2 border-border">
                    <User className="h-14 w-14 text-primary" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white cursor-pointer hover:bg-primary-hover transition-colors shadow-lg">
                  <Camera className="h-5 w-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
              {/* Save/Cancel buttons for avatar */}
              {hasAvatarChanges && (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCancelAvatar}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveAvatar}
                    loading={savingAvatar}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-content-primary">{user?.username}</h1>
              <p className="text-content-secondary mt-1 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user?.email}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background-secondary px-3 py-1 text-sm text-content-secondary">
                  {user?.provider === "google" ? "Google Account" : "Email Account"}
                </span>
                {user?.team && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background-secondary px-3 py-1 text-sm text-content-secondary">
                    <Users className="h-3.5 w-3.5" />
                    {user.team.name}
                  </span>
                )}
                {user?.createdAt && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background-secondary px-3 py-1 text-sm text-content-secondary">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Edit Username Card */}
            <Card>
              <CardHeader>
                <CardTitle>Username</CardTitle>
                <CardDescription>Update your username</CardDescription>
              </CardHeader>
              <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-2">
                    Username
                  </label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  {hasUsernameChanges && (
                    <Button variant="secondary" onClick={handleCancelUsername}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={handleSaveUsername}
                    loading={savingUsername}
                    disabled={!hasUsernameChanges}
                  >
                    {savingUsername ? "Saving..." : "Save Username"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Change Password Card - Only for local users */}
            {user?.provider === "local" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
                  <div>
                    <label className="block text-sm font-medium text-content-primary mb-2">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-content-primary mb-2">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-content-primary mb-2">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  {passwordError && (
                    <div className="text-danger text-sm">{passwordError}</div>
                  )}
                  <div className="flex justify-end">
                    <Button
                      onClick={handleChangePassword}
                      loading={changingPassword}
                      disabled={!currentPassword || !newPassword || !confirmPassword}
                    >
                      {changingPassword ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Profile;
