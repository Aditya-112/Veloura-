import React, { useState, useEffect, useRef } from "react";
import { useClerk } from "@clerk/react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Lock,
  LogOut,
  Edit3,
  Save,
  Loader2,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

const Profile: React.FC = () => {
  const { user, logout, updateProfile, uploadAvatar } = useAuth();
  const { openUserProfile } = useClerk();

  // Parse initial first & last name from user object
  const initialFirstName = user?.firstName || (user?.name ? user.name.split(" ")[0] : "Aditya");
  const initialLastName = user?.lastName || (user?.name ? user.name.split(" ").slice(1).join(" ") : "Jareda");

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [gender, setGender] = useState(user?.gender || "Prefer not to say");

  // Read-only / locked state for Profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Hidden file input ref for avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const fn = user.firstName || (user.name ? user.name.split(" ")[0] : "");
      const ln = user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : "");
      setFirstName(fn);
      setLastName(ln);
      if (user.gender) setGender(user.gender);
    }
  }, [user]);

  const fullName = `${firstName} ${lastName}`.trim() || user?.name || "User";

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "AJ";
    const parts = nameStr.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return nameStr.slice(0, 2).toUpperCase();
  };

  const formatJoinDate = (dateStr?: string) => {
    if (!dateStr) return "7 July 2026";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "7 July 2026";
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      await uploadAvatar(file);
      toast.success("Profile picture updated successfully!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to upload avatar.";
      toast.error(msg);
    } finally {
      setIsUploadingAvatar(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleCancelEditing = () => {
    if (user) {
      setFirstName(user.firstName || (user.name ? user.name.split(" ")[0] : ""));
      setLastName(user.lastName || (user.name ? user.name.split(" ").slice(1).join(" ") : ""));
      setGender(user.gender || "Prefer not to say");
    }
    setIsEditing(false);
  };

  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error("First Name cannot be empty.");
      return;
    }

    setIsSubmittingInfo(true);
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsSubmittingInfo(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
        {/* Hidden File Input for Avatar */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarFileSelect}
          accept="image/*"
          className="hidden"
        />

        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-soft text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Interactive Circular Profile Picture with Hover Overlay */}
            <div
              onClick={handleAvatarClick}
              className="relative group cursor-pointer h-20 w-20 shrink-0 rounded-full overflow-hidden shadow-sm border-2 border-slate-100 transition-all hover:shadow-md"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-xl font-extrabold text-white tracking-wider">
                  {getInitials(fullName)}
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-semibold gap-0.5">
                {isUploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Camera className="h-3.5 w-3.5" />
                    <span>Change</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                {fullName}
              </h1>
              <p className="text-xs font-medium text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {user?.email}
              </p>
              <div className="pt-0.5 flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                <span>Member Since • {formatJoinDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm shrink-0"
            >
              <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCancelEditing}
                disabled={isSubmittingInfo}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePersonalInfo}
                disabled={isSubmittingInfo}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isSubmittingInfo ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Personal Information Section */}
        <div id="personal-info-section" className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-soft">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-indigo-600" />
              Personal Information
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isEditing
                ? "Update your name and gender preferences below"
                : "Your account credentials and personal information"}
            </p>
          </div>

          <form onSubmit={handleSavePersonalInfo} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  required
                  className={`w-full rounded-2xl border px-4 py-2.5 text-xs font-medium transition-colors ${
                    isEditing
                      ? "border-slate-200 bg-slate-50/60 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                      : "border-slate-100 bg-slate-100/50 text-slate-600 cursor-not-allowed"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full rounded-2xl border px-4 py-2.5 text-xs font-medium transition-colors ${
                    isEditing
                      ? "border-slate-200 bg-slate-50/60 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                      : "border-slate-100 bg-slate-100/50 text-slate-600 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled={true}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-100/60 px-4 py-2.5 text-xs font-medium text-slate-500 cursor-not-allowed"
                />
                <p className="mt-1 text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>Email cannot be changed after account creation.</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full rounded-2xl border px-3.5 py-2.5 text-xs font-medium transition-colors ${
                    isEditing
                      ? "border-slate-200 bg-slate-50/60 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                      : "border-slate-100 bg-slate-100/50 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Account & Security Section */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-soft">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              Account & Security
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Your account security and password verification are managed via Clerk Authentication
            </p>
          </div>

          <div className="space-y-5">
            {/* Security Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/70 bg-indigo-50/40">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Protected by Clerk Authentication
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Your email, password, and session security are verified by Clerk with 2FA support.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openUserProfile()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors shrink-0"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Security & Password</span>
              </button>
            </div>

            {/* Logout Block */}
            <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Session
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Sign out of your active Veloura account
                </p>
              </div>

              <button
                onClick={logout}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/60 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors shrink-0"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
