import { ImagePlus, X } from "lucide-react";

const tileBase =
  "group relative overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200/80";

const RemoveImageButton = ({ onClick, disabled, label }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow-md ring-1 ring-black/5 backdrop-blur-sm transition-all hover:bg-white hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
    aria-label={label}
  >
    <X className="h-5 w-5" aria-hidden="true" />
  </button>
);

const CoverMarker = () => (
  <div
    className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-3 pb-3 pt-8"
    aria-hidden="true"
  >
    <span className="text-xs font-medium text-white/95">Cover photo</span>
  </div>
);

const PreviewTile = ({
  src,
  alt,
  isCover,
  canRemove,
  onRemove,
  disabled,
  className = "",
}) => (
  <div
    className={[
      tileBase,
      isCover ? "ring-2 ring-red-500/35 ring-offset-1 ring-offset-white" : "",
      className,
    ].join(" ")}
  >
    <img src={src} alt={alt} className="h-full w-full object-cover" />
    {isCover && <CoverMarker />}
    {canRemove && (
      <RemoveImageButton
        onClick={onRemove}
        disabled={disabled}
        label={`Remove ${alt}`}
      />
    )}
  </div>
);

const MobilePreviewStrip = ({ items, canRemove, onRemove, submitting }) => (
  <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
    {items.map((item, index) => (
      <PreviewTile
        key={item.key}
        src={item.src}
        alt={item.alt}
        isCover={index === 0}
        canRemove={canRemove && item.canRemove}
        onRemove={() => onRemove(index)}
        disabled={submitting}
        className="aspect-[4/3] w-[min(82vw,22rem)] shrink-0 snap-center"
      />
    ))}
  </div>
);

const DesktopPreviewGallery = ({
  items,
  canRemove,
  onRemove,
  submitting,
}) => {
  const count = items.length;

  if (count === 1) {
    return (
      <PreviewTile
        src={items[0].src}
        alt={items[0].alt}
        isCover
        canRemove={canRemove && items[0].canRemove}
        onRemove={() => onRemove(0)}
        disabled={submitting}
        className="aspect-[16/10] w-full sm:aspect-[2/1]"
      />
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {items.map((item, index) => (
          <PreviewTile
            key={item.key}
            src={item.src}
            alt={item.alt}
            isCover={index === 0}
            canRemove={canRemove && item.canRemove}
            onRemove={() => onRemove(index)}
            disabled={submitting}
            className="aspect-[4/3]"
          />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid h-[220px] grid-cols-2 gap-2 sm:h-[260px] sm:gap-3 lg:h-[300px]">
        <PreviewTile
          src={items[0].src}
          alt={items[0].alt}
          isCover
          canRemove={canRemove && items[0].canRemove}
          onRemove={() => onRemove(0)}
          disabled={submitting}
          className="row-span-2 h-full"
        />
        <PreviewTile
          src={items[1].src}
          alt={items[1].alt}
          canRemove={canRemove && items[1].canRemove}
          onRemove={() => onRemove(1)}
          disabled={submitting}
          className="h-full"
        />
        <PreviewTile
          src={items[2].src}
          alt={items[2].alt}
          canRemove={canRemove && items[2].canRemove}
          onRemove={() => onRemove(2)}
          disabled={submitting}
          className="h-full"
        />
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className="grid h-[220px] grid-cols-4 grid-rows-2 gap-2 sm:h-[280px] sm:gap-3 lg:h-[320px]">
        <PreviewTile
          src={items[0].src}
          alt={items[0].alt}
          isCover
          canRemove={canRemove && items[0].canRemove}
          onRemove={() => onRemove(0)}
          disabled={submitting}
          className="col-span-2 row-span-2 h-full"
        />
        <PreviewTile
          src={items[1].src}
          alt={items[1].alt}
          canRemove={canRemove && items[1].canRemove}
          onRemove={() => onRemove(1)}
          disabled={submitting}
          className="h-full"
        />
        <PreviewTile
          src={items[2].src}
          alt={items[2].alt}
          canRemove={canRemove && items[2].canRemove}
          onRemove={() => onRemove(2)}
          disabled={submitting}
          className="h-full"
        />
        <PreviewTile
          src={items[3].src}
          alt={items[3].alt}
          canRemove={canRemove && items[3].canRemove}
          onRemove={() => onRemove(3)}
          disabled={submitting}
          className="col-span-2 h-full"
        />
      </div>
    );
  }

  return (
    <div className="grid h-[240px] grid-cols-4 grid-rows-2 gap-2 sm:h-[280px] sm:gap-3 lg:h-[320px]">
      <PreviewTile
        src={items[0].src}
        alt={items[0].alt}
        isCover
        canRemove={canRemove && items[0].canRemove}
        onRemove={() => onRemove(0)}
        disabled={submitting}
        className="col-span-2 row-span-2 h-full"
      />
      {items.slice(1).map((item, index) => (
        <PreviewTile
          key={item.key}
          src={item.src}
          alt={item.alt}
          canRemove={canRemove && item.canRemove}
          onRemove={() => onRemove(index + 1)}
          disabled={submitting}
          className="h-full"
        />
      ))}
    </div>
  );
};

const VenueFormImagePreview = ({
  images,
  isRemoteGallery = false,
  onRemove,
  submitting = false,
}) => {
  if (!images?.length) return null;

  const items = images.map((img, index) => ({
    key: img.key || img.preview || img.url,
    src: img.url || img.preview,
    alt: isRemoteGallery
      ? `Current venue image ${index + 1}`
      : `Selected image ${index + 1}`,
    canRemove: !isRemoteGallery,
  }));

  return (
    <div className="mt-5 space-y-3">
      {isRemoteGallery && (
        <p className="text-sm font-medium text-gray-700">Current gallery</p>
      )}

      <MobilePreviewStrip
        items={items}
        canRemove={!isRemoteGallery}
        onRemove={onRemove}
        submitting={submitting}
      />

      <div className="hidden md:block">
        <DesktopPreviewGallery
          items={items}
          canRemove={!isRemoteGallery}
          onRemove={onRemove}
          submitting={submitting}
        />
      </div>

      {!isRemoteGallery && (
        <p className="text-xs text-gray-500">
          The first image is used as the cover photo on your venue listing.
        </p>
      )}
    </div>
  );
};

export const VenueFormImageUpload = ({
  inputId,
  label,
  required,
  disabled,
  canAddMore,
  maxImages,
  displayCount,
  error,
  maxHintId,
  errorId,
  describedBy,
  onImageChange,
}) => (
  <div>
    <label htmlFor={inputId} className="mb-3 block text-sm font-medium text-gray-700">
      {label}
      {required && (
        <span className="text-red-600" aria-hidden="true">
          {" "}
          *
        </span>
      )}
    </label>

    <div
      className={[
        "relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
        disabled && !canAddMore
          ? "border-gray-200 bg-gray-50"
          : "border-gray-200 bg-gradient-to-b from-gray-50/80 to-white hover:border-red-200 hover:from-red-50/40",
      ].join(" ")}
    >
      <input
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        onChange={onImageChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className="absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
      />

      <div className="pointer-events-none flex flex-col items-center px-4 py-8 text-center sm:py-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-100">
          <ImagePlus className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-3 text-sm font-medium text-gray-900">
          {canAddMore ? "Click to upload photos" : "Maximum images reached"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {displayCount} of {maxImages} uploaded · JPG, PNG, WEBP up to 5MB each
        </p>
      </div>
    </div>

    {!canAddMore && (
      <p id={maxHintId} className="mt-2 text-xs text-gray-500">
        Remove an image to upload another. Maximum {maxImages} images per venue.
      </p>
    )}

    {error && (
      <p id={errorId} role="alert" className="mt-2 text-sm text-red-600">
        {error}
      </p>
    )}
  </div>
);

export default VenueFormImagePreview;
