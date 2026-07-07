import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const username = searchParams.get("username");
    const email = searchParams.get("email");
    const team = searchParams.get("team");
    const avatar = searchParams.get("avatar");
    const provider = searchParams.get("provider");
    const createdAt = searchParams.get("createdAt");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Store JWT
    localStorage.setItem("token", token);

    // Store user (same format as normal login)
    localStorage.setItem(
      "user",
      JSON.stringify({
        id,
        username,
        email,
        team: team || null,
        avatar: avatar || "",
        provider,
        createdAt,
      })
    );

    // Redirect to dashboard
    navigate("/dashboard", { replace: true });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

        <h2 className="text-xl font-semibold">Signing you in...</h2>

        <p className="text-gray-400 mt-2">
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
}