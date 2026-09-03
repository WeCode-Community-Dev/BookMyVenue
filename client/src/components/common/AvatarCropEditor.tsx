import { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { getCroppedImageBlob } from '@/utils/cropImage';
import { useToast } from '@/hooks/useToast';
import Spinner from '@/components/common/Spinner';

interface AvatarCropEditorProps {
  imageSrc: string;
  onCancel: () => void;
  onSave: (file: File) => void;
  isSaving?: boolean;
}

const AvatarCropEditor = ({ imageSrc, onCancel, onSave, isSaving }: AvatarCropEditorProps) => {
  const toast = useToast();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || processing || isSaving) return;

    setProcessing(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
      onSave(file);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process the image');
    } finally {
      setProcessing(false);
    }
  };

  const busy = processing || isSaving;

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-2xl p-5">
        <h3 className="font-semibold text-[var(--text-primary)] mb-3">Adjust your photo</h3>

        <div className="relative h-72 rounded-xl overflow-hidden bg-black/20">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full mt-3 accent-[var(--bg-green)]"
          aria-label="Zoom"
        />

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={busy || !croppedAreaPixels}
            className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {busy && <Spinner size="h-3.5 w-3.5" />}
            {busy ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 rounded-xl border border-[var(--bg-grey)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-grey)]/30 transition disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropEditor;
