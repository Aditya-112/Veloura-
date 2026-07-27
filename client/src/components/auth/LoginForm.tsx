import { Eye, EyeOff } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
    try {
      setLoading(true);

      await login(data.email, data.password);

      toast.success("Welcome back!");

      navigate("/dashboard");
    } catch {
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md rounded-[32px] border border-white/40 bg-white/80 shadow-xl backdrop-blur-xl">
      <CardContent className="p-8 sm:p-10">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="space-y-6"
        >
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white">
              V
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Welcome Back
            </h2>

            <p className="mt-2 text-slate-500">
              Sign in to continue to Veloura.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Email
            </Label>

            <Input
              className="h-12 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
              type="email"
              placeholder="xyz@gmail.com"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-red-500">
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
            className="h-12 rounded-xl border-slate-200 bg-slate-50 pr-12 focus-visible:ring-2 focus-visible:ring-indigo-500"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            {...register("password")}
            />

            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
             >
            {showPassword ? (
            <EyeOff size={18} />
            ) : (
            <Eye size={18} />
            )}
        </button>
        </div>

            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
         <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-2xl bg-indigo-600 text-white transition-all duration-300 hover:scale-[1.02] hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
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
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;