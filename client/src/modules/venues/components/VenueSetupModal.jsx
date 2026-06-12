import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useEffect } from 'react';
import { updateVenueApi } from '../api/venue.api';

const VenueSetupModal = ({
    venue,
    onClose
}) => {

    const [imageInput, setImageInput] =
        useState('');

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: {
            isSubmitting
        }
    } = useForm({

        defaultValues: {
            address: venue.address || '',
            description: venue.description || '',
            capacity: venue.capacity || '',
            price: venue.price || '',
            images: venue.images || []
        }

    });

    useEffect(() => {
        reset({
           address: venue.address || '',
           description: venue.description || '',
           capacity: venue.capacity || '',
           price: venue.price || '',
           images: venue.images || []
        });
     }, [venue, reset]);

    const images = watch('images');

    const addImage = () => {

        const url = imageInput.trim();

        if (!url || images.includes(url)) {

            return;

        }

        setValue(
            'images',
            [...images, url]
        );

        setImageInput('');

    };

    const removeImage = (url) => {

        setValue(
            'images',
            images.filter(
                image => image !== url
            )
        );

    };

    const onSubmit = async (data) => {

        try {

            const payload = {

                address: data.address,

                description: data.description,

                capacity: Number(
                    data.capacity
                ),

                price: Number(
                    data.price
                ),

                images: data.images

            };

            await updateVenueApi(
                venue.id,
                payload
            );

            alert(
                'Venue updated successfully'
            );

            onClose();

        } catch (error) {

            alert(
                error.response?.data?.message ||
                error.message
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
                        {...register('address')}
                        className="inputClass"
                    />

                    <textarea
                        rows={4}
                        placeholder="Description"
                        {...register('description')}
                        className="inputClass py-3"
                    />

                    <div className="grid grid-cols-2 gap-3">

                        <input
                            type="number"
                            placeholder="Capacity"
                            {...register(
                                'capacity'
                            )}
                            className="inputClass"
                        />

                        <input
                            type="number"
                            placeholder="Price"
                            {...register(
                                'price'
                            )}
                            className="inputClass"
                        />

                    </div>

                    <div>

                        <div className="flex gap-2">

                            <input
                                value={imageInput}
                                onChange={(e) =>
                                    setImageInput(
                                        e.target.value
                                    )
                                }
                                placeholder="Image URL"
                                className="inputClass"
                            />

                            <button
                                type="button"
                                onClick={addImage}
                                className="
                           btn-outline
                           whitespace-nowrap
                        "
                            >
                                Add
                            </button>

                        </div>

                        {
                            images.length > 0 && (

                                <div
                                    className="
                              flex
                              flex-wrap
                              gap-2
                              mt-3
                           "
                                >

                                    {images.map(
                                        image => (

                                            <span
                                                key={image}
                                                className="
                                       px-3
                                       py-1
                                       rounded-full
                                       bg-gray-100
                                    "
                                            >

                                                {image}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(
                                                            image
                                                        )
                                                    }
                                                    className="
                                          ml-2
                                       "
                                                >
                                                    ×
                                                </button>

                                            </span>

                                        )
                                    )}

                                </div>

                            )
                        }

                    </div>

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
                            disabled={isSubmitting}
                            className="btn-primary"
                        >
                            {
                                isSubmitting
                                    ? 'Saving...'
                                    : 'Save'
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
};

export default VenueSetupModal;