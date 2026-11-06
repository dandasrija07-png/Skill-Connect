import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  icon: Icon,
  className = "",
  containerClassName = "",
  ...props
}, ref) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <select
          ref={ref}
          className={`appearance-none block w-full rounded-xl border transition-colors duration-200 text-sm focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 py-2.5 ${
            Icon ? "pl-10" : "pl-3.5"
          } pr-10 ${
            error
              ? "border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-300 hover:border-slate-400 focus:border-indigo-600 focus:ring-indigo-500/20 text-slate-900 bg-white"
          } ${className}`}
          {...props}
        >
          {options.map((opt, idx) => {
            if (typeof opt === "string") {
              return (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              );
            }
            return (
              <option key={opt.value ?? idx} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
});

Select.displayName = "Select";

