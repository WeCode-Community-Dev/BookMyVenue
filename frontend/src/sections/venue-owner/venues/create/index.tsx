import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import {
    Box,
    Card,
    Grid,
    Stack,
    Alert,
    Button,
    MenuItem,
    TextField,
    CardHeader,
    Typography,
    CardContent,
} from '@mui/material';

import { VenueApiService } from 'src/api/venue';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

export interface CreateVenueFormValues {
    title: string;
    description: string;
    venueType: string;

    addressLine1: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;

    latitude?: number;
    longitude?: number;

    capacity: number;
    pricePerDay: number;

    amenityIds: string[];
}

const DEFAULT_VALUES: CreateVenueFormValues = {
    title: '',
    description: '',
    venueType: '',
    addressLine1: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    capacity: 0,
    pricePerDay: 0,
    amenityIds: [],
};

const venueTypes = [
    'HOTEL',
    'AUDITORIUM',
    'BANQUET_HALL',
    'RESORT',
    'CAFE',
    'MEETING_ROOM',
];

export function CreateVenueForm() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imageError, setImageError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const {
        control,
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateVenueFormValues>({
        defaultValues: DEFAULT_VALUES,
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: async ({
            venueData,
            files,
        }: {
            venueData: Record<string, unknown>;
            files: File[];
        }) => {
            const result = await VenueApiService.createVenue(venueData);

            if (files.length > 0) {
                await VenueApiService.uploadVenueImages(result.venueId, files);
            }

            return result;
        },
    });

    const onSubmit = async (data: CreateVenueFormValues) => {
        setSuccessMessage('');

        if (imageFiles.length === 0) {
            setImageError('At least one image is required');
            return;
        }

        const { amenityIds, ...rest } = data;

        await mutateAsync({
            venueData: {
                ...rest,
                amenities: amenityIds,
            },
            files: imageFiles,
        });

        reset(DEFAULT_VALUES);
        setImageFiles([]);
        setImageError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setSuccessMessage('Venue created successfully.');
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files;
        if (!selected?.length) return;

        const nextFiles = [...imageFiles, ...Array.from(selected)].slice(0, 10);
        setImageFiles(nextFiles);
        setImageError('');
        event.target.value = '';
    };

    const removeImage = (index: number) => {
        setImageFiles((prev) => {
            const next = prev.filter((_, i) => i !== index);
            if (next.length === 0) {
                setImageError('At least one image is required');
            }
            return next;
        });
    };

    return (
        <DashboardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card>
                            <CardHeader title="Venue Information" />

                            <CardContent>
                                <Stack spacing={3}>
                                    <TextField
                                        label="Venue Title"
                                        {...register('title', {
                                            required: 'Title is required',
                                        })}
                                        error={!!errors.title}
                                        helperText={errors.title?.message}
                                    />

                                    <TextField
                                        label="Description"
                                        multiline
                                        minRows={4}
                                        {...register('description', {
                                            required: 'Description is required',
                                        })}
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                    />

                                    <Controller
                                        control={control}
                                        name="venueType"
                                        rules={{
                                            required: 'Venue type required',
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                select
                                                label="Venue Type"
                                                {...field}
                                                error={!!errors.venueType}
                                                helperText={
                                                    errors.venueType?.message
                                                }
                                            >
                                                {venueTypes.map((type) => (
                                                    <MenuItem
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {type.replace(/_/g, ' ')}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label="Address"
                                                {...register('addressLine1', {
                                                    required: 'Address is required',
                                                })}
                                                error={!!errors.addressLine1}
                                                helperText={errors.addressLine1?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="City"
                                                {...register('city', {
                                                    required: 'City is required',
                                                })}
                                                error={!!errors.city}
                                                helperText={errors.city?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="State"
                                                {...register('state', {
                                                    required: 'State is required',
                                                })}
                                                error={!!errors.state}
                                                helperText={errors.state?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Country"
                                                {...register('country', {
                                                    required: 'Country is required',
                                                })}
                                                error={!!errors.country}
                                                helperText={errors.country?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Postal Code"
                                                {...register('postalCode', {
                                                    required: 'Postal code is required',
                                                })}
                                                error={!!errors.postalCode}
                                                helperText={errors.postalCode?.message}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                type="number"
                                                fullWidth
                                                label="Capacity"
                                                {...register('capacity', {
                                                    valueAsNumber: true,
                                                    required: 'Capacity is required',
                                                    min: {
                                                        value: 1,
                                                        message: 'Capacity must be at least 1',
                                                    },
                                                })}
                                                error={!!errors.capacity}
                                                helperText={errors.capacity?.message}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                type="number"
                                                fullWidth
                                                label="Price Per Day"
                                                {...register('pricePerDay', {
                                                    valueAsNumber: true,
                                                    required: 'Price is required',
                                                    min: {
                                                        value: 1,
                                                        message: 'Price must be greater than 0',
                                                    },
                                                })}
                                                error={!!errors.pricePerDay}
                                                helperText={errors.pricePerDay?.message}
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card
                            sx={{
                                borderColor: imageError ? 'error.main' : undefined,
                                borderWidth: imageError ? 1 : undefined,
                                borderStyle: imageError ? 'solid' : undefined,
                            }}
                        >
                            <CardHeader title="Venue Images" />

                            <CardContent>
                                <Stack spacing={2}>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={handleFileChange}
                                    />

                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        startIcon={<Iconify icon="mdi:image-plus" />}
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={imageFiles.length >= 10}
                                    >
                                        Choose Images
                                    </Button>

                                    <Typography variant="caption" color="text.secondary">
                                        At least 1 image required · up to 10 (JPG, PNG, WEBP)
                                    </Typography>

                                    {imageError && (
                                        <Typography variant="caption" color="error">
                                            {imageError}
                                        </Typography>
                                    )}

                                    {imageFiles.map((file, index) => (
                                        <Box
                                            key={`${file.name}-${index}`}
                                            sx={{
                                                p: 1,
                                                border: 1,
                                                borderColor: 'divider',
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={1.5}
                                                alignItems="center"
                                            >
                                                <Box
                                                    component="img"
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 1,
                                                        objectFit: 'cover',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                    flex={1}
                                                >
                                                    {file.name}
                                                </Typography>

                                                <Button
                                                    color="error"
                                                    size="small"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card sx={{ mt: 3 }}>
                            <CardContent>
                                <LoadingButton
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    loading={isPending}
                                >
                                    Create Venue
                                </LoadingButton>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>
        </DashboardContent>
    );
}
