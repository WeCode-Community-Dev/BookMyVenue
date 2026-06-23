import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

const MAX_IMAGES = 5;

interface PendingFile {
    id: string;
    file: File;
    preview: string;
}

interface ImageUploadProps {
    images: string[];
    setImages: (images: string[]) => void;
    onPendingChange?: (files: File[]) => void;
    error?: string;
}

export function ImageUpload({ images, setImages, onPendingChange, error }: ImageUploadProps) {
    const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const canAddMore = images.length + pendingFiles.length < MAX_IMAGES;

    function updatePending(updater: (prev: PendingFile[]) => PendingFile[]) {
        setPendingFiles((prev) => {
            const next = updater(prev);
            onPendingChange?.(next.map((p) => p.file));
            return next;
        });
    }

    function handleFiles(files: FileList | File[]) {
        const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
        const slots = MAX_IMAGES - images.length - pendingFiles.length;
        const toAdd = arr.slice(0, slots);
        if (!toAdd.length) return;

        const entries: PendingFile[] = toAdd.map((f) => ({
            id: crypto.randomUUID(),
            file: f,
            preview: URL.createObjectURL(f),
        }));

        updatePending((prev) => [...prev, ...entries]);
    }

    function removeUploaded(url: string) {
        setImages(images.filter((u) => u !== url));
    }

    function removePending(id: string) {
        updatePending((prev) => {
            const entry = prev.find((u) => u.id === id);
            if (entry) URL.revokeObjectURL(entry.preview);
            return prev.filter((u) => u.id !== id);
        });
    }

    function onDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        if (canAddMore) handleFiles(e.dataTransfer.files);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-foreground">Venue Photos</label>
                <span className="text-xs text-muted-foreground">
                    {images.length + pendingFiles.length}/{MAX_IMAGES}
                </span>
            </div>

            {(images.length > 0 || pendingFiles.length > 0) && (
                <div className="grid grid-cols-5 gap-2 mb-3">
                    {images.map((url) => (
                        <div
                            key={url}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-border"
                        >
                            <Image fill src={url} alt="venue" className="object-cover" />
                            <button
                                onClick={() => removeUploaded(url)}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    ))}
                    {pendingFiles.map((p) => (
                        <div
                            key={p.id}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-border"
                        >
                            <Image fill src={p.preview} alt="pending" className="object-cover" />
                            <button
                                onClick={() => removePending(p.id)}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {canAddMore && (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        dragOver ? "border-primary bg-primary/5" : error ? "border-red-400" : "border-border hover:border-primary/50"
                    }`}
                >
                    <Upload className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                        Drag & drop photos or <span className="text-primary font-medium">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                        JPG, PNG up to 10MB · max {MAX_IMAGES} photos
                    </p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        className="hidden"
                        onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    />
                </div>
            )}
        </div>
    );
}
