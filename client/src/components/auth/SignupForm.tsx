import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useClerk, useAuth as useClerkAuth } from "@clerk/react";

import velouraLogo from "../../assets/Logo.png";

import {
  signupSchema,
  type SignupFormData,
} from "../../schemas/signup.schema";

import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

import { useAuth } from "../../context/AuthContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { client, setActive } = useClerk();
  const { isLoaded } = useClerkAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email Verification State
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [signupData, setSignupData] = useState<SignupFormData | null>(null);

  const handleSignup = async (data: SignupFormData) => {
    if (!isLoaded || !client) return;
    try {
      setLoading(true);
      const nameParts = data.name.trim().split(" ");
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "";

      await client.signUp.create({
        emailAddress: data.email,
        password: data.password,
        firstName,
        lastName,
      });

      await client.signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setSignupData(data);
      setPendingVerification(true);
      toast.success("Verification code sent to your email!");
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "Failed to create account.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !client || !code.trim()) return;
    try {
      setLoading(true);
      const completeSignUp = await client.signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        if (signupData) {
          await signup(signupData.name, signupData.email, signupData.password);
        }
        toast.success("Email verified! Account created successfully.");
        navigate("/dashboard");
      } else {
        toast.error("Verification incomplete. Please check the code.");
      }
    } catch (err: any) {
      const errorMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "Invalid verification code.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <Card className="mx-auto w-full max-w-[460px] rounded-[32px] sm:rounded-[36px] bg-white/35 backdrop-blur-[32px] shadow-[0_35px_90px_rgba(92,58,255,.16)] border border-white/40 p-6 sm:p-8">
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm mb-2">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Verify Your Email
            </h2>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              We sent a 6-digit verification code to{" "}
              <strong className="text-slate-800 font-semibold">{signupData?.email}</strong>
            </p>
          </div>

          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-xs font-bold text-slate-700">
                Verification Code
              </Label>
              <Input
                id="code"
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                required
                className="h-12 text-center text-lg font-bold tracking-widest rounded-2xl border-slate-200 bg-white/60 focus-visible:border-indigo-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || code.trim().length < 6}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:opacity-95 transition-all"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Verify & Complete Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="
        mx-auto
        w-full
        max-w-[460px]
        rounded-[32px] sm:rounded-[36px]

        bg-white/35
        backdrop-blur-[32px]

        shadow-[0_35px_90px_rgba(92,58,255,.16)]

        ring-1
        ring-white/50

        overflow-hidden
      "
    >
      <CardContent className="px-8 py-6 sm:px-10 sm:py-7">
        <form
          onSubmit={handleSubmit(handleSignup)}
          className="space-y-3"
        >
          {/* Logo */}
          <div className="flex justify-center mb-0.5">
            <div className="rounded-[24px] bg-white/20 p-1.5 backdrop-blur-md">
              <img
                src={velouraLogo}
                alt="Veloura"
                draggable={false}
                className="h-20 w-20 sm:h-22 sm:w-22 rounded-[22px] object-cover drop-shadow-[0_12px_24px_rgba(92,59,254,.18)]"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-[32px] sm:text-[36px] font-extrabold tracking-[-0.03em] text-slate-900 leading-tight">
              Create Account
            </h2>

            <p className="mt-0.5 text-xs sm:text-sm leading-relaxed text-slate-500">
              Join Veloura and build your AI wardrobe.
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">
              Full Name
            </Label>

            <Input
              className="h-11 sm:h-12 rounded-2xl border border-slate-200/80 bg-white/65 shadow-[0_4px_14px_rgba(0,0,0,.04)] transition-all duration-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-300 text-xs sm:text-sm"
              type="text"
              placeholder="Your Name"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-xs text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">
              Email
            </Label>

            <Input
              className="h-11 sm:h-12 rounded-2xl border border-slate-200/80 bg-white/65 shadow-[0_4px_14px_rgba(0,0,0,.04)] transition-all duration-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-300 text-xs sm:text-sm"
              type="email"
              placeholder="Email ID"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">
              Password
            </Label>

            <div className="relative">
              <Input
                className="h-11 sm:h-12 rounded-2xl border border-slate-200/80 bg-white/65 shadow-[0_4px_14px_rgba(0,0,0,.04)] transition-all duration-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-300 text-xs sm:text-sm pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400 transition hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-700">
              Confirm Password
            </Label>

            <div className="relative">
              <Input
                className="h-11 sm:h-12 rounded-2xl border border-slate-200/80 bg-white/65 shadow-[0_4px_14px_rgba(0,0,0,.04)] transition-all duration-300 focus-visible:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-300 text-xs sm:text-sm pr-10"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400 transition hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-xs text-red-400">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="
              h-11 sm:h-[50px]
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-[#5B41FF]
              to-[#8A63FF]
              font-bold tracking-wide
              text-white
              shadow-[0_15px_30px_rgba(91,65,255,.30)]
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:-translate-y-0.2
              hover:shadow-[0_20px_40px_rgba(91,65,255,.40)]
              active:scale-[0.98]
              disabled:opacity-70
              mt-1
            "
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Already have an account link */}
          <div className="text-center text-xs sm:text-sm text-violet-500 pt-1">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-violet-600 hover:text-violet-700 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignupForm;
