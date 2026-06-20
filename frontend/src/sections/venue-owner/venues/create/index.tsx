import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import {
    Box,
    Card,
    Grid,
    Stack,
    Button,
    MenuItem,
    TextField,
    CardHeader,
    Typography,
    CardContent,
} from '@mui/material';

import { VenueApiService } from 'src/api/venue';
import { DashboardContent } from 'src/layouts/dashboard';


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

    imageUrls: string[];
    amenityIds: string[];
}

const venueTypes = [
    'HOTEL',
    'AUDITORIUM',
    'BANQUET_HALL',
    'RESORT',
    'CAFE',
    'MEETING_ROOM',
];

export function CreateVenueForm() {
    const [imageUrl, setImageUrl] = useState('');

    const {
        control,
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateVenueFormValues>({
        defaultValues: {
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
            imageUrls: [],
            amenityIds: [],
        },
    });

    const images = watch('imageUrls');

    const { mutateAsync, isPending } = useMutation({
        mutationFn: VenueApiService.createVenue,
    });

    const onSubmit = async (data: CreateVenueFormValues) => {
        await mutateAsync(data);
    };

    const addImage = () => {
        if (!imageUrl.trim()) {
            return;
        }

        setValue('imageUrls', [...images, imageUrl]);

        setImageUrl('');
    };

    const removeImage = (url: string) => {
        setValue(
            'imageUrls',
            images.filter((x) => x !== url)
        );
    };

    return (
        <DashboardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                                        {...register('description')}
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
                                                        {type}
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
                                                {...register('addressLine1')}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="City"
                                                {...register('city')}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="State"
                                                {...register('state')}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Country"
                                                {...register('country')}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Postal Code"
                                                {...register('postalCode')}
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
                                                })}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                type="number"
                                                fullWidth
                                                label="Price Per Day"
                                                {...register('pricePerDay', {
                                                    valueAsNumber: true,
                                                })}
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                            <CardHeader title="Venue Images" />

                            <CardContent>
                                <Stack spacing={2}>
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Image URL"
                                            value={imageUrl}
                                            onChange={(e) =>
                                                setImageUrl(
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <Button
                                            variant="contained"
                                            onClick={addImage}
                                        >
                                            Add
                                        </Button>
                                    </Stack>

                                    {images.map((url) => (
                                        <Box
                                            key={url}
                                            sx={{
                                                p: 1,
                                                border: 1,
                                                borderColor:
                                                    'divider',
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="center"
                                            >
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                >
                                                    {url}
                                                </Typography>

                                                <Button
                                                    color="error"
                                                    size="small"
                                                    onClick={() =>
                                                        removeImage(
                                                            url
                                                        )
                                                    }
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