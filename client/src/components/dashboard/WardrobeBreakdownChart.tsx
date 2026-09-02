import React from "react";
import type { CategoryBreakdown } from "../../types/wardrobe";
import { PieChart, Filter } from "lucide-react";

interface WardrobeBreakdownChartProps {
  breakdown: CategoryBreakdown[];
  totalClothes: number;
}

const WardrobeBreakdownChart: React.FC<WardrobeBreakdownChartProps> = ({
  breakdown,
  totalClothes,
}) => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-soft shadow-card-hover flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-indigo-600" />
            Wardrobe Distribution
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Category breakdown across {totalClothes} total garments
          </p>
        </div>
        <a
          href="/wardrobe"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          title="Filter Wardrobe"
        >
          <Filter className="h-4 w-4" />
        </a>
      </div>

      {/* Visual Stacked Distribution Bar */}
      <div className="my-5">
        <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 shadow-inner">
          {breakdown.map((item) => (
            <div
              key={item.category}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:opacity-85 relative group"
              style={{
                width: `${Math.max(item.percentage, 4)}%`,
                backgroundColor: item.color,
              }}
            >
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                <div className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg whitespace-nowrap">
                  {item.category}: {item.count} items ({item.percentage}%)
                </div>
                <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical Clean Legend List */}
      <div className="space-y-2">
        {breakdown.map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-2.5 transition-colors hover:bg-slate-100/80"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 shrink-0 rounded-full shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-bold text-slate-800 tracking-tight whitespace-nowrap">
                {item.category}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="font-bold text-slate-900">{item.count} items</span>
              <span className="text-slate-400 font-medium">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardrobeBreakdownChart;
