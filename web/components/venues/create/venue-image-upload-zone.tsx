"use client";

import * as React from "react";
import { CloudUpload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VenueImageUploadZoneProps = {
  onFilesSelected: (files: FileList) => void;
  title?: string;
  description?: string;
  buttonLabel?: string;
};

export function VenueImageUploadZone({
  onFilesSelected,
  title = "Drag and drop images here",
  description = "Upload at least 5 high-resolution photos of your venue. Support for JPG, PNG, and HEIC up to 20MB.",
  buttonLabel = "Select Files from Device",
}: VenueImageUploadZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    onFilesSelected(files);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    handleFiles(event.dataTransfer.files);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center gap-4 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors",
        isDragOver
          ? "border-surface-tint bg-primary-container/10"
          : "border-outline-variant bg-surface-container-low/30"
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-primary-container/30 text-surface-tint">
        <CloudUpload className="size-7" />
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-base font-semibold text-on-surface">
          {title}
        </p>
        <p className="text-sm text-on-surface-variant">
          {description}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />
      <Button type="button" onClick={() => inputRef.current?.click()}>
        {buttonLabel}
      </Button>
    </div>
  );
}
