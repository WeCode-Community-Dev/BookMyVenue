"use client";

import { Upload, Plus } from "lucide-react";

export default function PhotosUploadForm() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 lg:p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <Upload className="h-5 w-5 text-teal-600" />

        <h2 className="font-semibold text-slate-900">
          4. Photos
        </h2>
      </div>

      <div className="grid gap-4">
        {/* Cover Image */}
        <div className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 transition hover:border-teal-400 hover:bg-teal-50/30">
          <Upload className="mb-2 h-7 w-7 text-teal-600" />

          <p className="text-sm font-medium text-slate-900">
            Upload Cover Image
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Recommended: 1280 × 720 px
          </p>
        </div>

        {/* Gallery Images */}
        <div>
          <p className="mb-3 text-sm font-medium text-slate-700">
            Additional Photos
          </p>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <button
                key={item}
                type="button"
                className="flex h-16 w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-300 transition hover:border-teal-400 hover:bg-teal-50/30"
              >
                <Plus className="h-5 w-5 text-slate-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Upload Hint */}
        <p className="text-xs text-slate-500">
          Upload up to 10 high-quality venue photos.
        </p>
      </div>
    </div>
  );
}

