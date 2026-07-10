import React, { useRef, useState, useEffect } from 'react';
import Cropper, { type ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { X, Check, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  onSave: (croppedFiles: File[]) => void;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ isOpen, onClose, images, onSave }) => {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [croppedBlobs, setCroppedBlobs] = useState<Blob[]>([]);

  useEffect(() => {
    if (isOpen && images.length > 0) {
      setCurrentIndex(0);
      setCroppedBlobs(new Array(images.length).fill(null));
    }
  }, [isOpen, images]);

  if (!isOpen || images.length === 0) return null;

  const saveCurrentCropToBlob = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (typeof cropperRef.current?.cropper !== 'undefined') {
        const canvas = cropperRef.current.cropper.getCroppedCanvas({
          maxWidth: 2000,
          maxHeight: 2000,
          fillColor: '#fff',
        });
        if (canvas) {
          canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  };

  const handleNext = async () => {
    setIsProcessing(true);
    const blob = await saveCurrentCropToBlob();
    if (blob) {
      setCroppedBlobs((prev) => {
        const next = [...prev];
        next[currentIndex] = blob;
        return next;
      });
    }
    setCurrentIndex((prev) => prev + 1);
    setIsProcessing(false);
  };

  const handlePrevious = async () => {
    setIsProcessing(true);
    const blob = await saveCurrentCropToBlob();
    if (blob) {
      setCroppedBlobs((prev) => {
        const next = [...prev];
        next[currentIndex] = blob;
        return next;
      });
    }
    setCurrentIndex((prev) => prev - 1);
    setIsProcessing(false);
  };

  const handleFinish = async () => {
    setIsProcessing(true);
    const blob = await saveCurrentCropToBlob();

    if (blob) {
      const finalBlobs = [...croppedBlobs];
      finalBlobs[currentIndex] = blob;

      // Convert all blobs to Files
      const files = finalBlobs.map((b, i) => {
        const timestamp = new Date().getTime() + i;
        // Fallback to the current blob if one is somehow missing
        const targetBlob = b || blob;
        return new File([targetBlob], `cropped_image_${timestamp}.jpg`, {
          type: 'image/jpeg',
          lastModified: timestamp,
        });
      });

      onSave(files);
      setIsProcessing(false);
      onClose();
    } else {
      toast.error('Failed to process image');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden border border-border flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
          <h2 className="text-lg font-semibold text-foreground">
            {images.length > 1
              ? `Crop Image ${currentIndex + 1} of ${images.length}`
              : 'Crop Image'}
          </h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 text-muted hover:text-foreground hover:bg-background rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cropper Body */}
        <div className="p-6 bg-surface/50 overflow-hidden flex-1 relative">
          <div className="w-full h-[50vh] min-h-[300px] bg-black/5 rounded-xl overflow-hidden border border-border">
            <Cropper
              ref={cropperRef}
              src={images[currentIndex]}
              style={{ height: '100%', width: '100%' }}
              aspectRatio={16 / 9}
              guides={true}
              viewMode={1}
              dragMode="move"
              scalable={true}
              cropBoxMovable={true}
              cropBoxResizable={true}
              background={false}
              responsive={true}
              checkOrientation={false}
              crossOrigin="anonymous"
            />
          </div>
          <p className="text-xs text-muted mt-4 text-center">
            Drag the image to position it. Use the corners to resize the crop area.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-background">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground hover:bg-surface rounded-xl border border-transparent transition-colors disabled:opacity-50"
          >
            {images.length > 1 ? 'Cancel All' : 'Cancel'}
          </button>

          <div className="flex items-center gap-3">
            {currentIndex > 0 && (
              <button
                onClick={handlePrevious}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-foreground bg-surface hover:bg-surface/80 rounded-xl border border-border transition-colors disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
            )}

            {currentIndex < images.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:bg-accent transition-all active:scale-95 disabled:opacity-50"
              >
                Next
                {isProcessing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl shadow-lg shadow-primary/20 hover:bg-accent transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                {images.length > 1 ? 'Finish All' : 'Save Crop'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;
