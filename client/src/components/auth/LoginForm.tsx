import { Eye, EyeOff } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useClerk, useAuth as useClerkAuth } from "@clerk/react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import velouraLogo from "../../assets/Logo.png";

import {
  loginSchema,
  type LoginFormData,
} from "../../schemas/login.schema";

import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

import { useAuth } from "../../context/AuthContext";

import { toast } from "sonner";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { client, setActive } = useClerk();
  const { isLoaded } = useClerkAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    if (!isLoaded || !client) return;
    try {
      setLoading(true);

      const result = await client.signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        await login(data.email, data.password);
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error("Verification required to complete sign-in.");
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "Invalid email or password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
           <Card
        className="
        mx-auto
        w-full
        max-w-[470px]
        rounded-[36px]

        bg-white/35
        backdrop-blur-[32px]

        shadow-[0_35px_90px_rgba(92,58,255,.16)]

        ring-1
        ring-white/50

        overflow-hidden
        "
        >
      <CardContent className="px-12 py-12 sm:px-12 sm:py-12">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="space-y-6"
        >
          {/* Logo */}

          <div className="flex justify-center mb-2">
                <div className="rounded-[30px] bg-white/20 p-2 backdrop-blur-md">
    <img
        src={velouraLogo}
        alt="Veloura"
        className="h-28 w-28 rounded-[28px] object-cover drop-shadow-[0_15px_30px_rgba(92,59,254,.18)]"
    />
</div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-[42px] font-extrabold tracking-[-0.03em] text-slate-900">
              Welcome Back
            </h2>

           <p className="mt-1 text-[16px] leading-relaxed text-slate-500">
              Sign in to continue to Veloura.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Email
            </Label>

            <Input
             className="h-14 rounded-2xl border border-slate-200/80 bg-white/65 shadow-[0_5px_18px_rgba(0,0,0,.05)] transition-all duration-300 focus-visible:border-violet-400
                        focus-visible:ring-4 focus-visible:ring-violet-300"
              type="email"
              placeholder="Email ID"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Password
            </Label>

            <div className="relative">
            <Input
            className="h-14 rounded-2xl border border-slate-200/80 bg-white/65 shadow-[0_5px_18px_rgba(0,0,0,.05)] transition-all duration-300 focus-visible:border-violet-400
                        focus-visible:4 focus-visible:ring-violet-300"
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
              <p className="text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
         <Button
            type="submit"
            disabled={loading}
            className="
                      h-[58px]
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
                      "
            >
            {loading ? (
                <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing In...
                </div>
            ) : (
                "Sign In"
            )}
          </Button>

          {/* Don't have an account link */}
          <div className="text-center text-sm text-violet-500 pt-2">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-violet-600 hover:text-violet-700 hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;