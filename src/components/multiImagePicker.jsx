import { useEffect, useMemo, useState } from "react";
import { GripVertical, ImagePlus, Star, Trash2, X } from "lucide-react";

export default function MultiImagePicker({ value = [], onChange, existing = false }) {
  const [items, setItems] = useState(() => value.map((item, index) => ({ id: `${index}-${item.name || item}`, file: item, url: typeof item === "string" ? item : URL.createObjectURL(item), existing: typeof item === "string" })));

  useEffect(() => {
    setItems(value.map((item, index) => ({ id: `${index}-${item.name || item}`, file: item, url: typeof item === "string" ? item : URL.createObjectURL(item), existing: typeof item === "string" })));
  }, [value]);



  const sync = (next) => {
    setItems(next);
    onChange(next.map((item) => item.file));
  };

  const addFiles = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024);
    if (!files.length) return;
    const next = [...items, ...files.map((file, i) => ({ id: `${Date.now()}-${i}-${file.name}`, file, url: URL.createObjectURL(file), existing: false }))];
    sync(next);
    event.target.value = "";
  };

  const remove = (id) => sync(items.filter((item) => item.id !== id));
  const move = (from, to) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    sync(next);
  };

  const hasImages = useMemo(() => items.length > 0, [items.length]);

  return (
    <div className="space-y-4">
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/60 px-5 text-center hover:border-pink-400 hover:bg-pink-50 transition">
        <ImagePlus className="mb-2 text-pink-500" size={28} />
        <span className="font-semibold text-gray-800">Add multiple product images</span>
        <span className="mt-1 text-xs text-gray-500">JPG, PNG or WEBP · up to 5MB each · first image is the main image</span>
        <input type="file" accept="image/*" multiple onChange={addFiles} className="hidden" />
      </label>

      {hasImages && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((item, index) => (
            <div key={item.id} className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <img src={item.url} alt={`Product ${index + 1}`} className="h-36 w-full object-cover" />
              {index === 0 && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-bold text-amber-600 shadow"><Star size={12} fill="currentColor" /> Main</span>}
              <div className="absolute right-2 top-2 flex gap-1">
                <button type="button" onClick={() => remove(item.id)} className="rounded-full bg-white/95 p-2 text-red-500 shadow hover:bg-red-50" aria-label="Remove image"><Trash2 size={14}/></button>
              </div>
              <div className="flex items-center justify-between gap-1 p-2">
                <span className="flex min-w-0 items-center gap-1 text-xs text-gray-500"><GripVertical size={13}/><span className="truncate">{item.file?.name || `Image ${index + 1}`}</span></span>
                <div className="flex gap-1">
                  <button type="button" disabled={index === 0} onClick={() => move(index, index - 1)} className="rounded-lg border px-2 py-1 text-xs disabled:opacity-30">←</button>
                  <button type="button" disabled={index === items.length - 1} onClick={() => move(index, index + 1)} className="rounded-lg border px-2 py-1 text-xs disabled:opacity-30">→</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!hasImages && existing && <p className="text-xs text-amber-600">No images selected. Keep at least one image before saving.</p>}
    </div>
  );
}
