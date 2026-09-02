import { Navigate } from "react-router-dom";

import SignupForm from "../components/auth/SignupForm";
import AuthHero from "../components/layout/AuthHero";

import { useAuth } from "../context/AuthContext";
import loginBackground from "../assets/login-bg.png";

const Signup = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FCFBFF]">
{/* ================= Veloura Silk Background ================= */}
{/* Silk Background */}
<div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: `url(${loginBackground})`,
  }}
/>

{/* White overlay */}
<div className="absolute inset-0 bg-white/45 backdrop-blur-[1px]" />


{/* Soft Ambient Glow */}
<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(185,150,255,0.07),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(185,150,255,0.05),transparent_35%)]" />

{/* Fine Silk Noise */}
<div
  className="absolute inset-0 opacity-[0.035] mix-blend-soft-light"
  style={{
    backgroundImage:
      "repeating-linear-gradient(120deg, rgba(255,255,255,.4) 0px, rgba(255,255,255,0) 3px, transparent 7px)",
  }}
/>


      {/* Main Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1450px] items-center justify-between gap-16 lg:gap-24 px-6 lg:px-10 py-6 lg:py-8">
        {/* Left Side */}
        <AuthHero />

        {/* Right Side */}
        <div className="relative w-full lg:w-1/2">

          <div
        className="
        pointer-events-none
        absolute
        left-1/2
        top-1/2
        h-[600px]
        w-[600px]
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        bg-gradient-to-tr
        from-violet-400/12
        via-white/50
        to-indigo-300/12
        blur-[150px]
        "
        />

    <div className="relative">
        <SignupForm />
    </div>

</div>
      </div>
    </div>
  );
};

export default Signup;
