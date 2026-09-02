import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  subtitle?: string;
  colorScheme?: 'indigo' | 'purple' | 'emerald' | 'amber';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  colorScheme = 'indigo',
}) => {
  const schemeStyles = {
    indigo: {
      bg: "bg-indigo-50/80 text-indigo-600 border-indigo-100",
      glow: "hover:border-indigo-200",
    },
    purple: {
      bg: "bg-purple-50/80 text-purple-600 border-purple-100",
      glow: "hover:border-purple-200",
    },
    emerald: {
      bg: "bg-emerald-50/80 text-emerald-600 border-emerald-100",
      glow: "hover:border-emerald-200",
    },
    amber: {
      bg: "bg-amber-50/80 text-amber-600 border-amber-100",
      glow: "hover:border-amber-200",
    },
  }[colorScheme];

  return (
    <div className={`group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-soft shadow-card-hover transition-all duration-300 ${schemeStyles.glow}`}>
      {/* Background Gradient Accent */}
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/10 blur-xl transition-all duration-500 group-hover:scale-125" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {value}
            </h3>
          </div>



          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 font-normal">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${schemeStyles.bg} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;