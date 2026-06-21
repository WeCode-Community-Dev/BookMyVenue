import { useState } from 'react';

import {
    Box,
    Grid,
    Stack,
    Button,
    Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

const AMENITY_ICONS: Record<string, string> = {
    wifi: 'mdi:wifi',
    parking: 'mdi:parking',
    ac: 'mdi:air-conditioner',
    projector: 'mdi:projector',
    catering: 'mdi:silverware-fork-knife',
    sound: 'mdi:music',
    stage: 'mdi:theater',
    security: 'mdi:shield-check',
    generator: 'mdi:lightning-bolt',
    dressing: 'mdi:hanger',
    pool: 'mdi:pool',
    garden: 'mdi:tree',
    elevator: 'mdi:elevator',
    accessibility: 'mdi:wheelchair-accessibility',
};

function getAmenityIcon(name: string): string {
    const lower = name?.toLowerCase();
    for (const [key, icon] of Object.entries(AMENITY_ICONS)) {
        if (lower?.includes(key)) return icon;
    }
    return 'mdi:check-circle-outline';
}

interface VenueAmenitiesProps {
    amenities: string[];
}

export function VenueAmenities({ amenities }: VenueAmenitiesProps) {
    const [showAll, setShowAll] = useState(false);
    const INITIAL_COUNT = 8;
    const displayedAmenities = showAll ? amenities : amenities.slice(0, INITIAL_COUNT);

    if (amenities.length === 0) return null;

    return (
        <Box>
            <Typography variant="h5" fontWeight={800} mb={3}>
                What this venue offers
            </Typography>

            <Grid container spacing={2} mb={2}>
                {displayedAmenities.map((amenity, index) => (
                    <Grid key={index} size={{ xs: 6, sm: 4, md: 3 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    bgcolor: 'primary.lighter',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <Iconify
                                    icon={getAmenityIcon(amenity)}
                                    color="primary.main"
                                    width={22}
                                />
                            </Box>
                            <Typography variant="body2" fontWeight={600}>{amenity}</Typography>
                        </Stack>
                    </Grid>
                ))}
            </Grid>

            {amenities.length > INITIAL_COUNT && (
                <Button
                    variant="outlined"
                    onClick={() => setShowAll(!showAll)}
                    sx={{ borderRadius: 2.5, fontWeight: 600, mt: 1 }}
                >
                    {showAll ? 'Show less' : `Show all ${amenities.length} amenities`}
                </Button>
            )}
        </Box>
    );
}
