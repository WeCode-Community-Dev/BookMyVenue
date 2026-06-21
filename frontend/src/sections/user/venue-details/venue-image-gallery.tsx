import { useState } from 'react';

import {
    Box,
    Grid,
    Stack,
    Dialog,
    IconButton,
    Typography,
    DialogContent,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface VenueImageGalleryProps {
    images: string[];
    title: string;
}

const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
];

export function VenueImageGallery({ images, title }: VenueImageGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const galleryImages =
        images.length > 0
            ? images
            : FALLBACK_IMAGES;

    const openLightbox = (index: number) => {
        setActiveIndex(index);
        setLightboxOpen(true);
    };

    const prev = () => setActiveIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
    const next = () => setActiveIndex((i) => (i + 1) % galleryImages.length);

    return (
        <>
            {/* Gallery Grid */}
            <Box sx={{ borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                <Grid container spacing={1} sx={{ height: { xs: 280, sm: 420, md: 500 } }}>
                    {/* Main Image */}
                    <Grid size={{ xs: 12, md: 8 }} sx={{ height: '100%' }}>
                        <Box
                            onClick={() => openLightbox(0)}
                            sx={{
                                height: '100%',
                                backgroundImage: `url(${galleryImages[0]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                cursor: 'pointer',
                                transition: 'filter 0.2s',
                                '&:hover': { filter: 'brightness(0.92)' },
                            }}
                        />
                    </Grid>

                    {/* Side Images */}
                    <Grid size={{ xs: 12, md: 4 }} sx={{ height: '100%', display: { xs: 'none', md: 'block' } }}>
                        <Stack spacing={1} sx={{ height: '100%' }}>
                            {galleryImages.slice(1, 3).map((img, i) => (
                                <Box
                                    key={i}
                                    onClick={() => openLightbox(i + 1)}
                                    sx={{
                                        flex: 1,
                                        backgroundImage: `url(${img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        transition: 'filter 0.2s',
                                        '&:hover': { filter: 'brightness(0.88)' },
                                    }}
                                >
                                    {i === 1 && galleryImages.length > 3 && (
                                        <Box
                                            onClick={(e) => { e.stopPropagation(); openLightbox(3); }}
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                bgcolor: 'rgba(0,0,0,0.45)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.55)' },
                                            }}
                                        >
                                            <Box textAlign="center">
                                                <Iconify icon="mdi:image-multiple" color="white" width={28} />
                                                <Typography variant="body2" color="white" fontWeight={700} mt={0.5}>
                                                    +{galleryImages.length - 3} more
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                {/* Mobile Show All Button */}
                <Box
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                    }}
                >
                    <Box
                        onClick={() => openLightbox(0)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            bgcolor: 'rgba(255,255,255,0.92)',
                            backdropFilter: 'blur(8px)',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: 13,
                        }}
                    >
                        <Iconify icon="mdi:image-multiple-outline" width={18} />
                        All Photos
                    </Box>
                </Box>
            </Box>

            {/* Lightbox Dialog */}
            <Dialog
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: 'rgba(0,0,0,0.95)',
                        borderRadius: 3,
                        m: { xs: 0, md: 4 },
                        maxHeight: '95vh',
                    },
                }}
            >
                <DialogContent sx={{ p: 0, position: 'relative', overflow: 'hidden' }}>
                    {/* Close Button */}
                    <IconButton
                        onClick={() => setLightboxOpen(false)}
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 10,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                        }}
                    >
                        <Iconify icon="mdi:close" />
                    </IconButton>

                    {/* Counter */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            zIndex: 10,
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        {activeIndex + 1} / {galleryImages.length}
                    </Box>

                    {/* Main Image */}
                    <Box
                        component="img"
                        src={galleryImages[activeIndex]}
                        alt={`${title} - ${activeIndex + 1}`}
                        sx={{
                            width: '100%',
                            maxHeight: '80vh',
                            objectFit: 'contain',
                            display: 'block',
                        }}
                    />

                    {/* Navigation */}
                    <IconButton
                        onClick={prev}
                        sx={{
                            position: 'absolute',
                            left: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
                        }}
                    >
                        <Iconify icon="mdi:chevron-left" width={28} />
                    </IconButton>
                    <IconButton
                        onClick={next}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
                        }}
                    >
                        <Iconify icon="mdi:chevron-right" width={28} />
                    </IconButton>

                    {/* Thumbnails */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1,
                            p: 2,
                            overflowX: 'auto',
                            bgcolor: 'rgba(0,0,0,0.6)',
                            justifyContent: 'center',
                        }}
                    >
                        {galleryImages.map((img, i) => (
                            <Box
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                sx={{
                                    width: 64,
                                    height: 48,
                                    flexShrink: 0,
                                    borderRadius: 1.5,
                                    overflow: 'hidden',
                                    border: i === activeIndex ? '2.5px solid white' : '2px solid transparent',
                                    cursor: 'pointer',
                                    opacity: i === activeIndex ? 1 : 0.6,
                                    transition: 'all 0.2s',
                                    '&:hover': { opacity: 0.9 },
                                }}
                            >
                                <Box
                                    component="img"
                                    src={img}
                                    alt=""
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
