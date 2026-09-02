import React, { useState, useRef } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useWardrobe } from "../context/WardrobeContext";
import type { ClothingCategory } from "../types/wardrobe";
import {
  Upload as UploadIcon,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Save,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";



import SearchableMultiSelect from "../components/common/SearchableMultiSelect";

const SEASON_OPTIONS = ["Spring", "Summer", "Fall", "Winter", "All Season"];
const OCCASION_OPTIONS = [
  "Casual",
  "Business Casual",
  "Formal",
  "Office",
  "College",
  "Party",
  "Wedding",
  "Gym",
  "Travel",
  "Date Night",
];

const Upload: React.FC = () => {
  const { updateClothing, analyzeImage } = useWardrobe();
  const navigate = useNavigate();

  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(0.97);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedItemId, setUploadedItemId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("Tops");
  const [subcategory, setSubcategory] = useState("");
  const [color, setColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [colorHex, setColorHex] = useState("#4f46e5");
  const [pattern, setPattern] = useState("");
  const [material, setMaterial] = useState("");
  const [fit, setFit] = useState("Tailored");
  const [formalityGrade, setFormalityGrade] = useState<number | undefined>(undefined);
  const [styleProfile, setStyleProfile] = useState<string | undefined>(undefined);
  const [breathability, setBreathability] = useState<string | undefined>(undefined);
  const [warmthRating, setWarmthRating] = useState<number | undefined>(undefined);
  const [season, setSeason] = useState<string[]>(["All Season"]);
  const [occasion, setOccasion] = useState<string[]>(["Casual"]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const processImageFile = async (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    simulateProgress();
    setIsAnalyzing(true);
    setAnalysisDone(false);

    try {
      const result = await analyzeImage(file);
      setUploadedItemId(result.id);
      setName(result.name || (result.subcategory ? `${result.color} ${result.subcategory}` : file.name.split('.')[0]));
      setCategory(result.category);
      setSubcategory(result.subcategory);
      setColor(result.color);
      setSecondaryColor(result.secondaryColor || "");
      setColorHex(result.colorHex);
      setPattern(Array.isArray(result.pattern) ? result.pattern.join(", ") : result.pattern);
      setMaterial(Array.isArray(result.material) ? result.material.join(", ") : result.material);
      if (result.fit) setFit(result.fit);
      if (result.formalityGrade) setFormalityGrade(result.formalityGrade);
      if (result.styleProfile) setStyleProfile(result.styleProfile);
      if (result.breathability) setBreathability(result.breathability);
      if (result.warmthRating) setWarmthRating(result.warmthRating);
      if (result.confidence) setConfidenceScore(result.confidence);

      const sVals = Array.isArray(result.season) ? result.season : (result.season ? [result.season] : ["All Season"]);
      setSeason(sVals as string[]);

      const oVals = Array.isArray(result.occasion) ? result.occasion : (result.occasion ? [result.occasion] : ["Casual"]);
      setOccasion(oVals as string[]);

      setAnalysisDone(true);
      toast.success("AI Feature Extraction Complete!");
    } catch {
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !selectedFile) {
      toast.error("Please select or upload an image first.");
      return;
    }

    try {
      let targetId = uploadedItemId;

      if (!targetId && selectedFile) {
        const result = await analyzeImage(selectedFile);
        targetId = result.id;
      }

      if (targetId) {
        await updateClothing(targetId, {
          name: name || "New Garment",
          category,
          subcategory: subcategory || "Garment",
          color: color || "Indigo",
          secondaryColor,
          colorHex: colorHex || "#4f46e5",
          pattern: pattern ? pattern.split(",").map((s) => s.trim()) : ["Solid"],
          material: material ? material.split(",").map((s) => s.trim()) : ["Fabric"],
          fit,
          formalityGrade,
          styleProfile,
          breathability,
          warmthRating,
          season,
          occasion,
        });
        toast.success("Garment saved to your Digital Wardrobe!");
        navigate("/wardrobe");
      } else {
        toast.error("Failed to save garment. Please upload an image first.");
      }
    } catch (error) {
      console.error("Failed to save garment:", error);
      toast.error("Failed to save garment. Please try again.");
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setUploadProgress(0);
    setIsAnalyzing(false);
    setAnalysisDone(false);
    setName("");
    setSubcategory("");
    setColor("");
    setSeason(["All Season"]);
    setOccasion(["Casual"]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
              <UploadIcon className="h-7 w-7 text-indigo-600" />
              Upload & AI Vision Extraction
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              Upload garment photos for high-precision computer vision metadata extraction
            </p>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Drag & Drop Zone + Image Preview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft shadow-card-hover">
              <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-indigo-600" />
                  Garment Image
                </span>
                {uploadProgress > 0 && (
                  <span className="text-xs font-semibold text-indigo-600">
                    {uploadProgress}% Uploaded
                  </span>
                )}
              </h2>

              {/* Progress Bar */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Drag & Drop Area */}
              {!previewUrl ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? "border-indigo-600 bg-indigo-50/60 scale-[1.02]"
                      : "border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100/80 text-indigo-600 mb-4 shadow-sm">
                    <UploadIcon className="h-8 w-8 animate-bounce" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Drag and drop your garment image
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Supports PNG, JPG, WEBP formats up to 10MB
                  </p>
                  <span className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors">
                    Select File
                  </span>
                </div>
              ) : (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <img
                    src={previewUrl}
                    alt="Garment Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md hover:bg-slate-900 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Replace Image</span>
                  </button>

                  {/* AI Scanning Overlay */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                      <Loader2 className="h-10 w-10 animate-spin text-indigo-400 mb-3" />
                      <p className="font-bold text-sm">Analyzing Garment Vision...</p>
                      <p className="text-xs text-indigo-200 mt-1">Extracting taxonomy, material & color spectrum</p>
                    </div>
                  )}
                </div>
              )}


            </div>
          </div>

          {/* Right Column: AI Feature Extraction Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-soft shadow-card-hover">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-glow">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      AI Vision Feature Extraction
                      {analysisDone && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Extracted
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Review or adjust AI extracted attributes before saving
                    </p>
                  </div>
                </div>

                {analysisDone && (
                  <div className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-100 self-start sm:self-auto">
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    <span>{Math.round(confidenceScore * 100)}% Confidence</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Garment Title
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Midnight Silk Indigo Blazer"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    >
                      <option value="Tops">Tops</option>
                      <option value="Bottoms">Bottoms</option>
                      <option value="Outerwear">Outerwear</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      placeholder="e.g. Oxford Shirt, Chelsea Boots"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Fashion Color
                    </label>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="e.g. Sky Blue, Indigo, Charcoal Grey"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Color Swatch
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        className="h-9 w-14 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                      />
                      <span className="text-xs font-mono font-semibold text-slate-600">{colorHex}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pattern(s)
                    </label>
                    <input
                      type="text"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder="e.g. Solid, Ribbed, Striped"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Material(s)
                    </label>
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      placeholder="e.g. Cashmere, Pure Silk, Denim"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fit
                  </label>
                  <input
                    type="text"
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    placeholder="e.g. Slim Fit, Oversized, Tailored"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SearchableMultiSelect
                    label="Optimum Season(s)"
                    options={SEASON_OPTIONS}
                    selectedValues={season}
                    onChange={setSeason}
                    placeholder="Select seasons..."
                  />

                  <SearchableMultiSelect
                    label="Occasion Vibe(s)"
                    options={OCCASION_OPTIONS}
                    selectedValues={occasion}
                    onChange={setOccasion}
                    placeholder="Select occasions..."
                  />
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-xs font-bold text-white shadow-glow hover:opacity-95 transition-all hover:scale-105"
                  >
                    <Save className="h-4 w-4" />
                    Save Clothing Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upload;