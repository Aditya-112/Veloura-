import React, { useState, useMemo } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useWardrobe } from "../context/WardrobeContext";
import type { Occasion, OutfitRecommendation } from "../types/wardrobe";
import { useLiveWeather } from "../hooks/useLiveWeather";
import { WeatherService } from "../services/weatherService";
import {
  Sparkles,
  Sun,
  CloudRain,
  Snowflake,
  Wind,
  Layers,
  Bookmark,
  Share2,
  RefreshCw,
  Star,
  Award,
  Shirt,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const occasions: Occasion[] = [
  "Office",
  "College",
  "Casual",
  "Party",
  "Wedding",
  "Gym",
  "Travel",
  "Date Night",
  "Formal",
  "Business Casual",
];

const weatherOptions = [
  { id: "Sunny & Warm 24°C", label: "Sunny & Mild", icon: Sun, color: "text-amber-500 bg-amber-50" },
  { id: "Chilly Fall 14°C", label: "Chilly / Autumn", icon: Wind, color: "text-indigo-500 bg-indigo-50" },
  { id: "Cold Winter 2°C", label: "Freezing Winter", icon: Snowflake, color: "text-cyan-500 bg-cyan-50" },
  { id: "Rainy & Breezy 16°C", label: "Rainy Weather", icon: CloudRain, color: "text-blue-500 bg-blue-50" },
];

const Outfits: React.FC = () => {
  const { generateOutfits, currentSessionOutfits, items } = useWardrobe();
  const { weather: liveWeather, loading: weatherLoading, error: weatherError, permissionDenied } = useLiveWeather();

  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>("Business Casual");
  const [manualWeather, setManualWeather] = useState("Sunny & Warm 24°C");
  const [showManualSelection, setShowManualSelection] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedList, setGeneratedList] = useState<OutfitRecommendation[]>(currentSessionOutfits);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hasGenerated, setHasGenerated] = useState(currentSessionOutfits.length > 0);
  const [showReasoning, setShowReasoning] = useState(false);

  React.useEffect(() => {
    setGeneratedList(currentSessionOutfits);
    setHasGenerated(currentSessionOutfits.length > 0);
    if (currentSessionOutfits.length === 0) {
      setSelectedIndex(0);
    }
  }, [currentSessionOutfits]);

  const getDynamicStyleTip = (weatherObj: any, activeStr: string): string => {
    if (weatherObj) {
      const temp = weatherObj.temperature;
      const cond = weatherObj.condition.toLowerCase();
      if (cond.includes("rain") || cond.includes("shower") || cond.includes("drizzle") || weatherObj.precipitation > 0) {
        return "Light showers expected. Waterproof footwear or a light rain jacket is recommended.";
      }
      if (temp <= 12 || weatherObj.feelsLike <= 12) {
        return "Cold conditions today. Layering with a warm coat or knitwear is recommended.";
      }
      if (temp <= 17 || weatherObj.feelsLike <= 17) {
        return "Cool conditions today. Light layering is sufficient for comfort.";
      }
      if (weatherObj.windSpeed >= 15) {
        return "Breezy conditions today. A lightweight outer layer is recommended.";
      }
      if (temp >= 28 || weatherObj.feelsLike >= 30) {
        return "Breathable cotton fabrics are ideal for today's weather. Light layering is sufficient for comfort.";
      }
      return "Pleasant weather today. Breathable core garments are recommended.";
    }

    const str = activeStr.toLowerCase();
    if (str.includes("rain")) {
      return "Light showers expected. Waterproof footwear or a light rain jacket is recommended.";
    }
    if (str.includes("cold") || str.includes("winter") || str.includes("2°c")) {
      return "Cold conditions today. Layering with a warm coat or knitwear is recommended.";
    }
    if (str.includes("chilly") || str.includes("14°c")) {
      return "Cool conditions today. Light layering is sufficient for comfort.";
    }
    return "Breathable cotton fabrics are ideal for today's weather. Light layering is sufficient for comfort.";
  };

  const activeWeatherStr = useMemo(() => {
    if (showManualSelection || (!liveWeather && !weatherLoading)) {
      return manualWeather;
    }
    if (liveWeather) {
      return WeatherService.formatWeatherString(liveWeather);
    }
    return manualWeather;
  }, [liveWeather, weatherLoading, showManualSelection, manualWeather]);

  const currentOutfit = generatedList[selectedIndex] || null;

  const handleGenerate = () => {
    if (!items || items.length === 0) {
      toast.error("Please upload clothing items to your digital wardrobe first.");
      return;
    }

    setIsGenerating(true);
    setHasGenerated(true);
    setTimeout(() => {
      const recommendations = generateOutfits(selectedOccasion, activeWeatherStr);
      setGeneratedList(recommendations);
      setSelectedIndex(0);
      setIsGenerating(false);
      if (recommendations.length > 0) {
        toast.success(`Curated ${recommendations.length} tailored outfit options!`);
      } else {
        toast.error(
          "Your wardrobe does not currently contain enough clothing for this occasion and weather. Consider adding suitable garments."
        );
      }
    }, 1100);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-indigo-600 animate-spin" style={{ animationDuration: "10s" }} />
              Personal Fashion Stylist
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              Curated, wearable outfit recommendations tailored specifically to your wardrobe
            </p>
          </div>
        </div>

        {/* Input Controls Card */}
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-slate-50/80 to-indigo-50/30 p-6 sm:p-8 shadow-soft shadow-card-hover space-y-6">
          <div className="grid gap-6 md:grid-cols-12">
            {/* Occasion Selection */}
            <div className="md:col-span-6 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Target Occasion
              </label>
              <div className="flex flex-wrap gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`rounded-2xl px-3.5 py-2 text-xs font-bold transition-all duration-200 ${
                      selectedOccasion === occ
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Integration Column */}
            <div className="md:col-span-6 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Current Weather
              </label>

              {/* Compact Weather Summary Card */}
              {weatherLoading ? (
                <div className="flex items-center gap-3 rounded-2xl border border-indigo-100/80 bg-white/80 p-4 backdrop-blur-md shadow-xs">
                  <RefreshCw className="h-4 w-4 text-indigo-600 animate-spin" />
                  <span className="text-xs font-semibold text-slate-600">
                    Detecting location & fetching live weather...
                  </span>
                </div>
              ) : (
                <div className="rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-sm relative overflow-hidden backdrop-blur-md space-y-3">
                  {/* Top Weather Info Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-2xl border border-indigo-100/60 shadow-xs shrink-0">
                        {liveWeather ? liveWeather.icon : "☀️"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                          <span>{liveWeather ? liveWeather.city : "Delhi"}</span>
                          {liveWeather && !showManualSelection && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-extrabold text-emerald-800 ml-1">
                              Live Weather
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-extrabold text-slate-800 flex items-center gap-2 mt-0.5">
                          <span className="text-indigo-600 font-extrabold text-sm">
                            {liveWeather ? `${liveWeather.temperature}°C` : manualWeather.split(" ")[0]}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            {liveWeather ? `Feels like ${liveWeather.feelsLike}°C` : "Feels like 26°C"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowManualSelection(!showManualSelection)}
                      className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold underline shrink-0 transition-colors self-start sm:self-center"
                    >
                      {showManualSelection && liveWeather ? "Use Live Weather" : "Override Weather"}
                    </button>
                  </div>

                  {/* Divider & Compact "💡 Style Tip" Section */}
                  <div className="pt-2.5 border-t border-indigo-100/70">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900 mb-0.5">
                      <span className="text-sm">💡</span>
                      <span>Style Tip</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {getDynamicStyleTip(liveWeather, activeWeatherStr)}
                    </p>
                  </div>
                </div>
              )}

              {/* Manual Weather Selection Chips (only when overridden or fallback) */}
              {!weatherLoading && (showManualSelection || (!liveWeather && (permissionDenied || weatherError))) && (
                <div className="space-y-2.5 pt-1 animate-in fade-in duration-200">
                  {permissionDenied && !showManualSelection && (
                    <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200/80 p-2 text-[11px] text-amber-800 font-medium">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span>Live weather unavailable. Please select weather manually below.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {weatherOptions.map((w) => {
                      const Icon = w.icon;
                      const isSelected = manualWeather === w.id;

                      return (
                        <button
                          key={w.id}
                          onClick={() => setManualWeather(w.id)}
                          className={`flex flex-col items-center justify-center rounded-2xl p-2.5 text-center transition-all duration-200 border ${
                            isSelected
                              ? "border-indigo-600 bg-white shadow-md shadow-indigo-500/10 scale-105"
                              : "border-slate-200 bg-white/70 hover:bg-white text-slate-600"
                          }`}
                        >
                          <div className={`flex h-7 w-7 items-center justify-center rounded-xl ${w.color} mb-1`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-900">{w.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-indigo-100/80 flex items-center justify-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-8 py-4 text-xs font-bold text-white shadow-glow hover:opacity-95 transition-all hover:scale-105 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Curating Style Looks...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-purple-200" />
                  <span>Curate Recommended Outfits</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Empty Wardrobe Prompt */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-8">
            <Shirt className="h-12 w-12 text-indigo-400 mb-3" />
            <h3 className="text-base font-bold text-slate-900">Your Wardrobe is Empty</h3>
            <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
              Upload garment photos to start receiving tailored fashion recommendations from your actual wardrobe.
            </p>
            <a
              href="/upload"
              className="rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
            >
              Upload Clothes Now
            </a>
          </div>
        )}

        {/* No Matching Clothes Banner */}
        {items.length > 0 && hasGenerated && generatedList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center rounded-3xl border border-amber-200 bg-amber-50/60 p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mb-3">
              <Shirt className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Suitable Outfit Found</h3>
            <p className="text-xs text-slate-600 max-w-lg mt-1 mb-3 font-medium leading-relaxed">
              Your wardrobe does not currently contain enough clothing for this occasion and weather. Consider adding winter outerwear or suitable garments.
            </p>
            
            {/* Missing Categories Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5">
              <span className="text-[11px] font-bold text-slate-500 mr-1">Suggested Additions:</span>
              {(() => {
                const missing: string[] = [];
                const hasOuterwear = items.some((i) => i.category === "Outerwear");
                const hasShoes = items.some((i) => i.category === "Footwear" || i.category === "Shoes");
                const hasTops = items.some((i) => i.category === "Tops" || i.category === "Top");
                const hasBottoms = items.some((i) => i.category === "Bottoms" || i.category === "Bottom");
                const isCold = activeWeatherStr.toLowerCase().includes("cold") || activeWeatherStr.toLowerCase().includes("winter") || activeWeatherStr.toLowerCase().includes("chilly");

                if (isCold && !hasOuterwear) missing.push("Winter Outerwear / Coat");
                if (!hasTops) missing.push("Tops / Shirts");
                if (!hasBottoms) missing.push("Bottoms / Trousers");
                if (!hasShoes) missing.push("Footwear / Shoes");
                if (missing.length === 0) missing.push(`${selectedOccasion}-Appropriate Garments`);

                return missing.map((cat) => (
                  <span key={cat} className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-900">
                    + {cat}
                  </span>
                ));
              })()}
            </div>

            <a
              href="/upload"
              className="rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
            >
              Upload Suitable Garments
            </a>
          </div>
        )}

        {/* Multi-Outfit Recommendations Display */}
        {generatedList.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Options Tabs Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-indigo-600" />
                  Stylist Recommendations ({generatedList.length} Curated Options)
                </h3>
              </div>

              {/* Options Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {generatedList.map((item, idx) => {
                  const isSelected = selectedIndex === idx;
                  const isBest = idx === 0;

                  return (
                    <button
                      key={item.id || idx}
                      onClick={() => setSelectedIndex(idx)}
                      className={`relative flex flex-col items-start justify-between rounded-2xl p-4 transition-all duration-200 border text-left ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20 scale-105"
                          : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:shadow-md"
                      }`}
                    >
                      {isBest && (
                        <span className="absolute -top-2.5 right-2 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-extrabold text-slate-900 shadow-sm">
                          <Sparkles className="h-2.5 w-2.5 fill-slate-900 text-slate-900" />
                          Stylist's Pick
                        </span>
                      )}

                      <div className="w-full">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${isSelected ? "text-indigo-300" : "text-indigo-600"}`}>
                          {item.optionTitle || `Option ${idx + 1}`}
                        </span>
                        <h4 className="text-xs font-bold truncate mt-0.5">{item.name || item.title}</h4>
                      </div>

                      <div className="mt-3 flex items-center justify-between w-full border-t pt-2 border-slate-200/40">
                        <span className={`text-[11px] font-extrabold ${isSelected ? "text-indigo-300" : "text-indigo-600"}`}>
                          Curated Look
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Outfit Detail Display */}
            {currentOutfit && (
              <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white p-6 sm:p-8 shadow-soft">
                <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

                {/* Outfit Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-extrabold text-indigo-700 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-indigo-600 text-indigo-600" />
                        {currentOutfit.optionTitle || `Option ${selectedIndex + 1}`}
                      </span>
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                        {currentOutfit.occasion}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {currentOutfit.name || currentOutfit.title}
                    </h2>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toast.success("Outfit saved to your bookmarks!")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Bookmark className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Bookmark</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Outfit link copied to clipboard!");
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Share2 className="h-3.5 w-3.5 text-purple-600" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Clean, Human-Friendly "Why this outfit?" Section */}
                <div className="rounded-3xl border border-indigo-100/90 bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-slate-50/50 p-6 shadow-soft mb-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      Why this outfit?
                    </h3>
                  </div>

                  {/* Visual Tags / Chips */}
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm border border-slate-200/80">
                      🏷️ {currentOutfit.occasion}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm border border-slate-200/80">
                      {liveWeather ? liveWeather.icon : "🌡️"}{" "}
                      {liveWeather ? `${liveWeather.condition} ${liveWeather.temperature}°C` : activeWeatherStr.split(" ")[0]}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm border border-slate-200/80">
                      💙 Color Balanced
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm border border-slate-200/80">
                      😌 Comfortable Fit
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm border border-slate-200/80">
                      ✨ Minimal Elegance
                    </span>
                    {currentOutfit.items.some((i) => i.category === "Outerwear") && (
                      <span className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm border border-slate-200/80">
                        🧥 Layered Look
                      </span>
                    )}
                  </div>

                  {/* Garment-Specific Bullet Points */}
                  <ul className="space-y-2 text-xs font-medium text-slate-700 pt-1">
                    {(currentOutfit.bulletPoints && currentOutfit.bulletPoints.length > 0
                      ? currentOutfit.bulletPoints
                      : [
                          `Matches your selected ${currentOutfit.occasion} occasion.`,
                          `Suitable for today's ${activeWeatherStr.split(" ")[0].toLowerCase()} climate.`,
                          `The ${currentOutfit.items.map((i) => i.color).filter(Boolean).slice(0, 2).join(" & ")} tones complement each other naturally.`,
                          `Makes effective, stylish use of your actual wardrobe pieces.`,
                        ]
                    ).map((point, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Collapsible "Stylist Notes" Accordion */}
                  <div className="pt-3 border-t border-indigo-100/80 space-y-3">
                    <button
                      onClick={() => setShowReasoning(!showReasoning)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      <span>Stylist Notes</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          showReasoning ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showReasoning && (
                      <div className="p-4 rounded-2xl bg-white/90 border border-indigo-100 text-xs text-slate-600 leading-relaxed space-y-2 animate-in fade-in duration-200 shadow-sm">
                        <p className="font-medium text-slate-700 font-sans">
                          {currentOutfit.stylistNotes || currentOutfit.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Outfit Garments Grid */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    Ensemble Garment Selection ({currentOutfit.items.length} pieces)
                  </h3>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {currentOutfit.items.map((item) => (
                      <div
                        key={item.id}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100 mb-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-800 backdrop-blur-md">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs truncate">
                          {item.name}
                        </h4>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="truncate">{item.subcategory}</span>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            <span
                              className="h-2.5 w-2.5 rounded-full border border-slate-300"
                              style={{ backgroundColor: item.colorHex || "#4f46e5" }}
                            />
                            <span className="font-semibold text-indigo-600">{item.color}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Outfits;
