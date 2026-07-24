import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, Trash2, UploadCloud } from "lucide-react";
import {
  MAX_VENUE_IMAGES,
  uploadImagesToCloudinary,
  validateImageFile,
} from "../../utils/cloudinaryUpload";
import {
  addVenueImagesAsync,
  deleteVenueImageAsync,
  updateVenueImageAsync,
} from "../../modules/venueOwner/venueOwnerSlice";

function VenueImageManager({ venueId, images = [] }) {
  const dispatch = useDispatch();
  const saving = useSelector((s) => s.venueOwner.loading.venueImages);

  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [message, setMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const remaining = MAX_VENUE_IMAGES - images.length;
  const busy = uploading || saving;

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList ?? []);
    if (files.length === 0) return;

    if (remaining <= 0) {
      setMessage(`This venue already has ${MAX_VENUE_IMAGES} photos.`);
      return;
    }

    const accepted = [];
    let nextMessage = null;
    for (const file of files.slice(0, remaining)) {
      const fileError = validateImageFile(file);
      if (fileError) nextMessage = fileError;
      else accepted.push(file);
    }
    if (files.length > remaining) {
      nextMessage = `Only ${remaining} more photo${remaining === 1 ? "" : "s"} can be added.`;
    }
    setMessage(nextMessage);
    if (accepted.length === 0) return;

    try {
      setUploading(true);
      setUploadStatus({ index: 0, total: accepted.length, percent: 0 });
      const urls = await uploadImagesToCloudinary(accepted, setUploadStatus);
      await dispatch(addVenueImagesAsync({ venueId, urls }));
    } catch (err) {
      setMessage(err.message || "Photo upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadStatus(null);
    }
  };

  const handleFileInputChange = (e) => {
    uploadFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    uploadFiles(e.dataTransfer.files);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-rose-900">Photos</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {images.length}/{MAX_VENUE_IMAGES} uploaded. The cover photo is what guests see on
          search results. Changes apply instantly.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
            >
              <div className="relative">
                <img
                  src={image.url}
                  alt={`Venue photo ${index + 1}`}
                  className="w-full h-28 object-cover"
                />
                {image.is_cover && (
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-rose-900/90 text-white text-[10px] font-semibold">
                    Cover
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                <button
                  type="button"
                  disabled={busy || image.is_cover}
                  onClick={() =>
                    dispatch(
                      updateVenueImageAsync({
                        venueId,
                        imageId: image.id,
                        payload: { is_cover: true },
                      }),
                    )
                  }
                  className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-rose-800 disabled:opacity-40 disabled:hover:text-gray-500 transition-colors"
                >
                  <Star size={12} />
                  {image.is_cover ? "Cover photo" : "Set cover"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    dispatch(deleteVenueImageAsync({ venueId, imageId: image.id }))
                  }
                  className="p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
                  aria-label={`Delete photo ${index + 1}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {remaining > 0 && (
        <div
          onClick={() => !busy && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-1.5 h-28 rounded-xl border-2 border-dashed transition-colors ${
            busy ? "cursor-wait opacity-60" : "cursor-pointer"
          } ${
            isDragging
              ? "border-rose-400 bg-rose-50"
              : "border-gray-200 bg-gray-50 hover:border-rose-300 hover:bg-rose-50/40"
          }`}
        >
          <UploadCloud
            size={24}
            className={isDragging ? "text-rose-500" : "text-gray-300"}
          />
          <p className="text-xs font-medium text-gray-500">
            Drag & drop or{" "}
            <span className="text-rose-700 underline underline-offset-2">browse</span> to
            add photos
          </p>
          <p className="text-[11px] text-gray-400">JPG, PNG, WEBP or GIF · max 5 MB each</p>
        </div>
      )}

      {uploading && uploadStatus && (
        <p className="text-xs text-gray-500">
          Uploading photo {uploadStatus.index + 1} of {uploadStatus.total} —{" "}
          {uploadStatus.percent}%
        </p>
      )}

      {message && <p className="text-xs text-red-500">⚠ {message}</p>}
    </div>
  );
}

export default VenueImageManager;
