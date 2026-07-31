import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type ImageFile = {
  file: File;
  preview: string;
};

type ImageDropzoneProps = {
  images: ImageFile[];
  setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>;
};

function ImageDropzone({
  images,
  setImages,
}: ImageDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));  

      setImages((previousImages) => [
       ...previousImages,
       ...acceptedFiles.map((file) => ({
        file,
       preview: URL.createObjectURL(file),
       })),
      ]);
    },
    [setImages]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    multiple: true,
    onDrop,
  });

  return (
    <>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #999",
          borderRadius: "10px",
          padding: "40px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        <input {...getInputProps()} />

        <p>📷 Drag & Drop venue photos here</p>

        <p>or click to browse</p>
      </div>

      {images.length === 0 ? (
        <p>No images selected.</p>
      ) : (
        <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "20px",
  }}
>
  {images.map((image, index) => (
    <div
      key={index}
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
      }}
    >
      <img
        src={image.preview}
        alt={image.file.name}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "8px",
         }}
          />

        <p>{image.file.name}</p>

         <button
          type="button"
          onClick={() =>
          setImages((previousImages) => previousImages.filter((_, i) => i !== index)) }
             style={{
                     marginTop: "10px",
                     padding: "6px 12px",
                     cursor: "pointer",
                    }}>
              🗑 Delete
          </button>

        </div>
         ))}
      </div>
      )}
    </>
  );
}

export default ImageDropzone;