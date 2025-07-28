import { Globe } from "lucide-react";

export function AnimatedGlobe() {
  return (
    <div className="relative w-40 h-40 mx-auto mb-10">

      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-400 via-emerald-500 to-teal-400 blur-xl animate-pulse opacity-30"></div>

  
      <div className="absolute inset-1 rounded-full border-4 border-green-300 border-dashed animate-spin-slow"></div>

      <div className="absolute inset-4 rounded-full bg-white shadow-2xl flex items-center justify-center">
        <Globe className="h-14 w-14 text-green-600 animate-wiggle" />
      </div>
    </div>
  );
}
