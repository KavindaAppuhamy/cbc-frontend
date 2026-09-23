import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus, X } from "lucide-react";

export default function ImageSlider({ images = [] }) {
  const safeImages = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  const previous = () => setActiveIndex((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setActiveIndex((i) => (i + 1) % safeImages.length);

  useEffect(() => {
    const key = (event) => {
      if (!fullscreen && !safeImages.length) return;
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
      if (event.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [fullscreen, safeImages.length]);

  useEffect(() => setZoom(1), [activeIndex]);

  if (!safeImages.length) return <div className="aspect-square rounded-3xl bg-secondary flex items-center justify-center text-ink-soft">No image available</div>;

  const viewer = (large = false) => (
    <div className={`${large ? "fixed inset-0 z-[100] bg-black/90 p-4 sm:p-8" : "relative aspect-square rounded-3xl bg-secondary/70 overflow-hidden"}`}>
      {large && <button onClick={() => setFullscreen(false)} className="absolute right-4 top-4 z-20 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><X size={22}/></button>}
      <img src={safeImages[activeIndex]} alt={`Product image ${activeIndex + 1}`} className="h-full w-full object-contain transition-transform duration-200" style={{ transform: `scale(${zoom})` }} />
      <button onClick={previous} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-gray-800 shadow-lg hover:bg-white"><ChevronLeft/></button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-gray-800 shadow-lg hover:bg-white"><ChevronRight/></button>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/60 p-1.5 text-white">
        <button onClick={() => setZoom((z) => Math.max(1, +(z - .25).toFixed(2)))} className="rounded-full p-2 hover:bg-white/10"><Minus size={16}/></button>
        <span className="min-w-12 text-center text-xs font-semibold">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom((z) => Math.min(2.5, +(z + .25).toFixed(2)))} className="rounded-full p-2 hover:bg-white/10"><Plus size={16}/></button>
        {!large && <button onClick={() => setFullscreen(true)} className="rounded-full p-2 hover:bg-white/10"><Maximize2 size={16}/></button>}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-3">
      {viewer(false)}
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
        {safeImages.map((image, index) => <button key={`${image}-${index}`} onClick={() => setActiveIndex(index)} className={`aspect-square overflow-hidden rounded-xl border-2 ${index === activeIndex ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}><img src={image} alt={`Thumbnail ${index + 1}`} className="h-full w-full object-cover"/></button>)}
      </div>
      {fullscreen && viewer(true)}
    </div>
  );
}
