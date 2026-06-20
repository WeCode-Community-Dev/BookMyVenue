import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

import { updateVenueApi } from "../../venues/api/venue.api";

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
                    className="space-y-6"
                >

                    {/* Venue Info */}

                    <div
                        className="
      bg-gray-50
      border
      rounded-2xl
      p-4
    "
                    >
                        <h3 className="text-lg font-semibold">
                            {venue.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            {venue.city}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                            Complete your venue details before accepting bookings.
                        </p>
                    </div>

                    {/* Address */}

                    <div>
                        <label
                            className="
        block
        text-sm
        font-medium
        text-gray-700
        mb-2
      "
                        >
                            Address
                        </label>

                        <input
                            {...register("address")}
                            className="inputClass"
                        />
                    </div>

                    {/* Description */}

                    <div>
                        <label
                            className="
        block
        text-sm
        font-medium
        text-gray-700
        mb-2
      "
                        >
                            Description
                        </label>

                        <textarea
                            rows={4}
                            {...register("description")}
                            className="inputClass py-3"
                        />
                    </div>

                    {/* Capacity & Price */}

                    <div
                        className="
      grid
      grid-cols-1
      md:grid-cols-2
      gap-4
    "
                    >

                        <div>
                            <label
                                className="
          block
          text-sm
          font-medium
          text-gray-700
          mb-2
        "
                            >
                                Capacity
                            </label>

                            <input
                                type="number"
                                {...register("capacity")}
                                className="inputClass"
                            />
                        </div>

                        <div>
                            <label
                                className="
          block
          text-sm
          font-medium
          text-gray-700
          mb-2
        "
                            >
                                Price Per Day (₹)
                            </label>

                            <input
                                type="number"
                                {...register("price")}
                                className="inputClass"
                            />
                        </div>

                    </div>

                    {/* Existing Images */}

                    {images.length > 0 && (
                        <div>

                            <div className="flex items-center justify-between mb-3">

                                <h3 className="font-semibold">
                                    Current Images
                                </h3>

                                <span className="text-xs text-gray-500">
                                    Uploading new images will replace these.
                                </span>

                            </div>

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

                        </div>
                    )}

                    {/* Upload Section */}

                    <div>

                        <h3 className="font-semibold mb-3">
                            Venue Photos
                        </h3>

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

                            <span className="text-5xl mb-3">
                                📸
                            </span>

                            <p className="font-semibold">
                                Upload Venue Photos
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                Maximum 5 images
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
                                disabled={selectedFiles.length >= 5}
                                onChange={handleFileChange}
                            />

                        </label>

                        <p className="text-xs text-gray-500 mt-2">
                            {selectedFiles.length}/5 selected
                        </p>

                    </div>

                    {/* New Images Preview */}

                    {selectedFiles.length > 0 && (

                        <div>

                            <h3 className="font-semibold mb-3">
                                New Images
                            </h3>

                            <div
                                className="
          grid
          grid-cols-2
          md:grid-cols-3
          gap-4
        "
                            >

                                {selectedFiles.map((file, index) => (

                                    <div
                                        key={index}
                                        className="
              relative
              group
              rounded-xl
              overflow-hidden
              border
            "
                                    >

                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt=""
                                            className="
                h-36
                w-full
                object-cover
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
                w-8
                h-8
                rounded-full
                bg-white
                shadow
              "
                                        >
                                            ✕
                                        </button>

                                        <div
                                            className="
                absolute
                bottom-0
                left-0
                right-0
                bg-black/50
                text-white
                text-xs
                px-2
                py-1
                truncate
              "
                                        >
                                            {file.name}
                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    )}

                    {/* Footer */}

                    <div
                        className="
      flex
      justify-end
      gap-3
      pt-4
      border-t
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
                            disabled={isSubmitting}
                            className="btn-primary"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default VenueSetupModal;