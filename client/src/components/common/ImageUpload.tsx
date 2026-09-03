import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';

interface ImageUploadProps {
  fieldName: 'coverImage' | 'galleryImages';
  existingUrls: string[];
  onChange: (files: File[], existingUrls: string[]) => void;
  maxFiles?: number;
}

export function ImageUpload({
  fieldName,
  existingUrls,
  onChange,
  maxFiles = 10,
}: ImageUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>(() => existingUrls);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const prevExistingUrlsRef = useRef(existingUrls);

  useEffect(() => {
    if (prevExistingUrlsRef.current !== existingUrls) {
      prevExistingUrlsRef.current = existingUrls;
      setPreviewUrls(existingUrls);
    }
  }, [existingUrls]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const handleFileChange = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const remainingSlots = maxFiles - previewUrls.length;
    const filesToAdd = fileArray.slice(0, remainingSlots);

    const newPreviewUrls = filesToAdd.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setFiles((prev) => [...prev, ...filesToAdd]);
    onChange(filesToAdd, previewUrls);
  };

  const removeImage = (index: number) => {
    const isExisting = index < existingUrls.length;

    if (isExisting) {
      const newExisting = existingUrls.filter((_, i) => i !== index);
      setPreviewUrls((prev) => {
        const urlToRevoke = prev[index];
        if (urlToRevoke.startsWith('blob:')) {
          URL.revokeObjectURL(urlToRevoke);
        }
        return prev.filter((_, i) => i !== index);
      });
      onChange(files, newExisting);
    } else {
      const fileIndex = index - existingUrls.length;
      setPreviewUrls((prev) => {
        const urlToRevoke = prev[index];
        if (urlToRevoke.startsWith('blob:')) {
          URL.revokeObjectURL(urlToRevoke);
        }
        return prev.filter((_, i) => i !== index);
      });
      setFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      onChange(
        files.filter((_, i) => i !== fileIndex),
        existingUrls
      );
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const isCoverImage = fieldName === 'coverImage';
  const maxAllowed = isCoverImage ? 1 : maxFiles;
  const canAddMore = previewUrls.length < maxAllowed;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[var(--text-primary)]">
        {isCoverImage ? 'Cover Image' : 'Gallery Images'}
        <span className="text-[var(--text-secondary)] ml-1">
          ({previewUrls.length}/{maxAllowed})
        </span>
      </label>

      <div
        className={`relative border-2 rounded-xl p-4 transition-colors ${
          isDragging ? 'border-[var(--bg-green)] bg-[var(--bg-green)]/5' : 'border-[var(--bg-grey)]'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border border-[var(--bg-grey)]"
            >
              <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {canAddMore && (
            <label
              className={`relative aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-[var(--bg-green)] bg-[var(--bg-green)]/5'
                  : 'border-[var(--bg-grey)] hover:border-[var(--bg-green)]'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                multiple={!isCoverImage}
                onChange={(e) => e.target.files && handleFileChange(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2 text-[var(--text-secondary)]">
                <Plus size={24} />
                <span className="text-sm">{isCoverImage ? 'Add cover' : 'Add images'}</span>
              </div>
            </label>
          )}
        </div>

        {previewUrls.length > 0 && (
          <p className="text-xs text-[var(--text-secondary)]">
            {isCoverImage
              ? 'Click X to replace cover image'
              : 'Drag to reorder (first image is cover)'}
          </p>
        )}
      </div>
    </div>
  );
}
