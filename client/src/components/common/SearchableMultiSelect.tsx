import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, X, Check, ChevronDown } from "lucide-react";

interface SearchableMultiSelectProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  usePortal?: boolean;
}

const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select options...",
  usePortal = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [portalPosition, setPortalPosition] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPortalPosition({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen && usePortal) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, usePortal]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (option: string) => {
    if (selectedValues.includes(option)) {
      onChange(selectedValues.filter((v) => v !== option));
    } else {
      onChange([...selectedValues, option]);
    }
  };

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== option));
  };

  const dropdownMenu = (
    <div
      ref={dropdownRef}
      style={
        usePortal
          ? {
              position: "fixed",
              top: `${portalPosition.top}px`,
              left: `${portalPosition.left}px`,
              width: `${portalPosition.width}px`,
              zIndex: 9999,
            }
          : undefined
      }
      className={`${
        usePortal
          ? ""
          : "absolute left-0 right-0 top-full mt-1.5 z-50"
      } rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl animate-in fade-in-50 zoom-in-95 duration-150`}
    >
      {/* Search Box */}
      <div className="relative mb-2">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${label.toLowerCase()}...`}
          onClick={(e) => e.stopPropagation()}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
        />
      </div>

      {/* Options List */}
      <div className="max-h-[260px] overflow-y-auto space-y-1 pr-3 pb-4 pt-0.5 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
        {filteredOptions.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            No matching options found
          </div>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = selectedValues.includes(option);
            return (
              <div
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(option);
                }}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{option}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        {label}
      </label>

      {/* Main trigger container */}
      <div
        ref={triggerRef}
        onClick={() => {
          if (!isOpen && usePortal) {
            updatePosition();
          }
          setIsOpen(!isOpen);
        }}
        className={`min-h-[42px] w-full rounded-2xl border px-3 py-2 text-xs font-medium bg-slate-50/60 cursor-pointer flex items-center justify-between gap-2 transition-all ${
          isOpen
            ? "border-indigo-500 bg-white ring-2 ring-indigo-500/10"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 max-w-full">
          {selectedValues.length === 0 ? (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          ) : (
            selectedValues.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100"
              >
                <span>{val}</span>
                <button
                  type="button"
                  onClick={(e) => removeOption(val, e)}
                  className="rounded-full hover:bg-indigo-200/80 p-0.5 text-indigo-500 hover:text-indigo-800 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-indigo-600" : ""
          }`}
        />
      </div>

      {/* Render dropdown inline or via portal */}
      {isOpen && (usePortal ? createPortal(dropdownMenu, document.body) : dropdownMenu)}
    </div>
  );
};

export default SearchableMultiSelect;
