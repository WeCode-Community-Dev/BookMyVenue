import { Upload, X, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

const MAX_IMAGES = 5;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

interface UploadingFile {
    id: string;
    preview: string;
    progress: "uploading" | "error";
}

interface ImageUploadProps {
    images: string[];
    setImages: (images: string[]) => void;
}

export function ImageUpload({ images, setImages }: ImageUploadProps) {
    const [uploading, setUploading] = useState<UploadingFile[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const canAddMore = images.length + uploading.length < MAX_IMAGES;

    async function uploadFile(file: File): Promise<string | null> {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: "POST", body: data }
        );

        if (!res.ok) return null;
        const json = await res.json() as { secure_url: string };
        return json.secure_url;
    }

    async function handleFiles(files: FileList | File[]) {
        const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
        const slots = MAX_IMAGES - images.length - uploading.length;
        const toUpload = arr.slice(0, slots);
        if (!toUpload.length) return;

        const entries: UploadingFile[] = toUpload.map((f) => ({
            id: crypto.randomUUID(),
            preview: URL.createObjectURL(f),
            progress: "uploading" as const,
        }));

        setUploading((prev) => [...prev, ...entries]);

        await Promise.all(
            toUpload.map(async (file, i) => {
                const entry = entries[i]!;
                const url = await uploadFile(file);
                if (url) {
                    setImages([...images, url]);
                    setUploading((prev) => prev.filter((u) => u.id !== entry.id));
                    URL.revokeObjectURL(entry.preview);
                } else {
                    setUploading((prev) =>
                        prev.map((u) =>
                            u.id === entry.id ? { ...u, progress: "error" as const } : u
                        )
                    );
                }
            })
        );
    }

    function removeUploaded(url: string) {
        setImages(images.filter((u) => u !== url));
    }

    function removeUploading(id: string) {
        setUploading((prev) => {
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
                <label className="block text-sm font-semibold text-foreground">
                    Venue Photos
                </label>
                <span className="text-xs text-muted-foreground">
                    {images.length + uploading.length}/{MAX_IMAGES}
                </span>
            </div>

            {(images.length > 0 || uploading.length > 0) && (
                <div className="grid grid-cols-5 gap-2 mb-3">
                    {images.map((url) => (
                        <div
                            key={url}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-border"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="venue" className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeUploaded(url)}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    ))}
                    {uploading.map((u) => (
                        <div
                            key={u.id}
                            className="relative aspect-square rounded-lg overflow-hidden border border-border"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={u.preview}
                                alt="uploading"
                                className="w-full h-full object-cover opacity-50"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                {u.progress === "uploading" ? (
                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                ) : (
                                    <button
                                        onClick={() => removeUploading(u.id)}
                                        className="flex flex-col items-center gap-1"
                                    >
                                        <X className="w-4 h-4 text-red-400" />
                                        <span className="text-red-400 text-[10px]">Failed</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {canAddMore && (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        dragOver
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                    }`}
                >
                    <Upload className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                        Drag & drop photos or{" "}
                        <span className="text-primary font-medium">browse</span>
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
