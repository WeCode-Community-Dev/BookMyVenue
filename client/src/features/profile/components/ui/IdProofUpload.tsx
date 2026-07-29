import React from 'react';
import { Upload, FileText, Eye } from 'lucide-react';
import ViewImage from '@/shared/components/ui/ViewImage';

interface IdProofUploadProps {
  idProofName: string;
  idProofPreview: string;
  idProofOpen: boolean;
  setIdProofOpen: (open: boolean) => void;
  idProofInputRef: React.RefObject<HTMLInputElement | null>;
  onIdProofChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IdProofUpload: React.FC<IdProofUploadProps> = ({
  idProofName,
  idProofPreview,
  idProofOpen,
  setIdProofOpen,
  idProofInputRef,
  onIdProofChange,
}) => {
  const isPdf = idProofName.toLowerCase().endsWith('.pdf');

  const handlePreviewClick = () => {
    if (isPdf) {
      // For PDFs, open the document in a new tab for a full preview
      window.open(idProofPreview, '_blank');
    } else {
      setIdProofOpen(true);
    }
  };

  return (
    <div className="space-y-2.5">
      <label className="text-sm font-semibold text-foreground/80">ID Proof (PDF, JPG, PNG)</label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => idProofInputRef.current?.click()}
          className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer flex items-center gap-2 transition-all duration-200"
        >
          <Upload size={14} />
          Upload Document
        </button>
        <input
          type="file"
          ref={idProofInputRef}
          onChange={onIdProofChange}
          accept="image/*,application/pdf"
          className="hidden"
        />

        {idProofName ? (
          <div className="flex items-center gap-3 p-2 border border-border rounded-xl bg-muted/10 max-w-xs sm:max-w-md">
            {/* Preview Thumbnail */}
            <div
              onClick={handlePreviewClick}
              className="relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-muted/20 flex items-center justify-center cursor-pointer group shrink-0"
            >
              {isPdf ? (
                <FileText className="w-6 h-6 text-red-500" />
              ) : idProofPreview ? (
                <img
                  src={idProofPreview}
                  alt="ID Proof Thumbnail"
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                />
              ) : (
                <FileText className="w-6 h-6 text-foreground/30" />
              )}
              {/* Hover overlay with eye icon */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Document Info */}
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                {idProofName}
              </p>
              <button
                type="button"
                onClick={handlePreviewClick}
                className="text-[10px] sm:text-xs font-medium text-primary hover:underline"
              >
                {isPdf ? 'Open PDF' : 'View Preview'}
              </button>
            </div>

            {/* Modal for viewing image */}
            {idProofOpen && !isPdf && idProofPreview && (
              <ViewImage url={idProofPreview} title="Id Proof of user" setOpen={setIdProofOpen} />
            )}
          </div>
        ) : (
          <span className="text-xs text-foreground/40">No document uploaded.</span>
        )}
      </div>
    </div>
  );
};

export default IdProofUpload;
