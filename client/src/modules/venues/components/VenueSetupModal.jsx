import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

import { updateVenueApi } from "../api/venue.api";

const VenueSetupModal = ({ venue, onClose }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { isSubmitting },
    } = useForm({
        defaultValues: {
            address: venue.address || "",
            description: venue.description || "",
            capacity: venue.capacity || "",
            price: venue.price || "",
            images: venue.images || [],
        },
    });

    useEffect(() => {
        reset({
            address: venue.address || "",
            description: venue.description || "",
            capacity: venue.capacity || "",
            price: venue.price || "",
            images: venue.images || [],
        });

        setSelectedFiles([]);
    }, [venue, reset]);

    const images = watch("images");

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        const totalFiles =
            selectedFiles.length + files.length;

        if (totalFiles > 5) {
            alert("You can upload a maximum of 5 images.");
            return;
        }

        setSelectedFiles((prev) => [
            ...prev,
            ...files,
        ]);

        e.target.value = "";
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            formData.append("address", data.address || "");
            formData.append(
                "description",
                data.description || ""
            );

            if (data.capacity) {
                formData.append(
                    "capacity",
                    data.capacity
                );
            }

            if (data.price) {
                formData.append(
                    "price",
                    data.price
                );
            }

            /*
             If new images are selected,
             replace existing images completely.
            */
            selectedFiles.forEach((file) => {
                formData.append("images", file);
            });

            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }
            await updateVenueApi(
                venue.id,
                formData
            );

            alert(
                "Venue updated successfully"
            );

            onClose();
        } catch (error) {
            alert(
                error.message ||
                "Failed to update venue"
            );
        }
    };

    return (
        <div
            className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
      "
        >
            <div
                className="
          bg-white
          rounded-2xl
          p-6
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
        "
            >
                <div
                    className="
            flex
            justify-between
            items-center
            mb-6
          "
                >
                    <h2 className="text-xl font-bold">
                        Complete Setup
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <input
                        placeholder="Address"
                        {...register("address")}
                        className="inputClass"
                    />

                    <textarea
                        rows={4}
                        placeholder="Description"
                        {...register(
                            "description"
                        )}
                        className="
              inputClass
              py-3
            "
                    />

                    <div
                        className="
            grid
            grid-cols-2
            md:grid-cols-3
            gap-4
          "
                    >
                        <input
                            type="number"
                            placeholder="Capacity"
                            {...register(
                                "capacity"
                            )}
                            className="inputClass"
                        />

                        <input
                            type="number"
                            placeholder="Price"
                            {...register("price")}
                            className="inputClass"
                        />
                    </div>

                    {/* Existing Images */}
                    {images.length > 0 && (
                        <div>
                            <p
                                className="
                  font-medium
                  mb-2
                "
                            >
                                Current Images
                            </p>

                            <div
                                className="
                grid
                grid-cols-2
                md:grid-cols-3
                gap-4
              "
                            >
                                {images.map((image) => (
                                    <img
                                        key={image}
                                        src={image}
                                        alt="Venue"
                                        className="
                      h-32
                      w-full
                      object-cover
                      rounded-xl
                    "
                                    />
                                ))}
                            </div>

                            <p
                                className="
                  text-xs
                  text-gray-500
                  mt-2
                "
                            >
                                Uploading new images
                                will replace these
                                images.
                            </p>
                        </div>
                    )}

                    {/* Upload */}
                    <div>
                        <p className="font-medium mb-2">
                            Venue Photos
                        </p>

                        <label
                            className={`
      border-2
      border-dashed
      rounded-2xl
      p-8
      flex
      flex-col
      items-center
      justify-center
      text-center
      cursor-pointer
      transition
      ${selectedFiles.length >= 5
                                    ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                                    : "hover:border-red-400 hover:bg-red-50"
                                }
    `}
                        >
                            <span className="text-4xl mb-3">
                                📸
                            </span>

                            <p className="font-semibold">
                                Add Venue Photos
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                Upload up to 5 high-quality images
                            </p>

                            <span
                                className="
        mt-4
        px-4
        py-2
        rounded-xl
        bg-red-600
        text-white
        text-sm
        font-medium
      "
                            >
                                Choose Photos
                            </span>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                disabled={
                                    selectedFiles.length >= 5
                                }
                                onChange={handleFileChange}
                            />
                        </label>

                        <p className="text-xs text-gray-500 mt-2">
                            {selectedFiles.length}/5 selected
                        </p>
                    </div>

                    {/* New Preview */}
                    {/* New Preview */}
                    {selectedFiles.length > 0 && (
                        <div>
                            <p className="font-medium mb-2">
                                New Images
                            </p>

                            <div
                                className="
        grid
        grid-cols-2
        gap-3
      "
                            >
                                {selectedFiles.map(
                                    (file, index) => (
                                        <div
                                            key={index}
                                            className="
              relative
            "
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt=""
                                                className="
                h-32
                w-full
                object-cover
                rounded-xl
              "
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeSelectedFile(index)
                                                }
                                                className="
                absolute
                top-2
                right-2
                bg-white
                rounded-full
                px-2
                shadow
              "
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    <div
                        className="
              flex
              justify-end
              gap-3
              pt-4
            "
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-outline"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                isSubmitting
                            }
                            className="btn-primary"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VenueSetupModal;