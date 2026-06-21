import type { VenueSearchFilters } from 'src/api/types/venue.type';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
    Box,
    Chip,
    Grid,
    Alert,
    Stack,
    Button,
    Drawer,
    Select,
    Slider,
    Divider,
    MenuItem,
    useTheme,
    Container,
    IconButton,
    InputLabel,
    Pagination,
    Typography,
    FormControl,
    OutlinedInput,
    useMediaQuery,
    InputAdornment,
} from '@mui/material';

import { VenuePublicApiService } from 'src/api/venue-public';

import { Iconify } from 'src/components/iconify';

import { VenueSearchCard, VenueSearchCardSkeleton } from './venue-search-card';

const VENUE_TYPES = [
    { value: '', label: 'All Types' },
    { value: 'BANQUET_HALL', label: 'Banquet Hall' },
    { value: 'CONFERENCE_ROOM', label: 'Conference Room' },
    { value: 'MEETING_ROOM', label: 'Meeting Room' },
    { value: 'EVENT_SPACE', label: 'Event Space' },
    { value: 'RESTAURANT', label: 'Restaurant' },
    { value: 'HOTEL', label: 'Hotel' },
    { value: 'RESORT', label: 'Resort' },
    { value: 'PARTY_HALL', label: 'Party Hall' },
    { value: 'AUDITORIUM', label: 'Auditorium' },
    { value: 'CAFE', label: 'Café' },
];

const SORT_OPTIONS = [
    { value: 'rating_desc', label: 'Top Rated' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
];

const PRICE_RANGE_MAX = 500000;

interface FilterState {
    query: string;
    city: string;
    venueType: string;
    priceRange: [number, number];
    minCapacity: number | '';
    sortBy: string;
}

function FiltersPanel({
    filters,
    onFiltersChange,
    onApply,
    onReset,
}: {
    filters: FilterState;
    onFiltersChange: (f: Partial<FilterState>) => void;
    onApply: () => void;
    onReset: () => void;
}) {
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight={700}>Filters</Typography>
                <Button size="small" onClick={onReset} sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Reset All
                </Button>
            </Stack>

            <Stack spacing={3.5}>
                {/* Venue Type */}
                <FormControl fullWidth size="small">
                    <InputLabel>Venue Type</InputLabel>
                    <Select
                        label="Venue Type"
                        value={filters.venueType}
                        onChange={(e) => onFiltersChange({ venueType: e.target.value })}
                        sx={{ borderRadius: 2 }}
                    >
                        {VENUE_TYPES.map((t) => (
                            <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* City */}
                <OutlinedInput
                    size="small"
                    placeholder="Filter by city..."
                    value={filters.city}
                    onChange={(e) => onFiltersChange({ city: e.target.value })}
                    startAdornment={
                        <InputAdornment position="start">
                            <Iconify icon="mdi:map-marker-outline" width={18} color="text.secondary" />
                        </InputAdornment>
                    }
                    sx={{ borderRadius: 2 }}
                />

                <Divider />

                {/* Price Range */}
                <Box>
                    <Typography variant="subtitle2" fontWeight={700} mb={2}>
                        Price Range (per day)
                    </Typography>
                    <Slider
                        value={filters.priceRange}
                        onChange={(_, val) => onFiltersChange({ priceRange: val as [number, number] })}
                        min={0}
                        max={PRICE_RANGE_MAX}
                        step={1000}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => `₹${(v / 1000).toFixed(0)}K`}
                        sx={{ mx: 0.5 }}
                    />
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                            ₹{filters.priceRange[0].toLocaleString('en-IN')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ₹{filters.priceRange[1].toLocaleString('en-IN')}
                        </Typography>
                    </Stack>
                </Box>

                <Divider />

                {/* Min Capacity */}
                <Box>
                    <Typography variant="subtitle2" fontWeight={700} mb={1.5}>
                        Minimum Capacity
                    </Typography>
                    <OutlinedInput
                        size="small"
                        fullWidth
                        type="number"
                        placeholder="e.g. 100"
                        value={filters.minCapacity}
                        onChange={(e) => onFiltersChange({ minCapacity: e.target.value ? Number(e.target.value) : '' })}
                        inputProps={{ min: 1 }}
                        startAdornment={
                            <InputAdornment position="start">
                                <Iconify icon="mdi:account-group-outline" width={18} color="text.secondary" />
                            </InputAdornment>
                        }
                        sx={{ borderRadius: 2 }}
                    />
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={onApply}
                    sx={{
                        borderRadius: 2.5,
                        fontWeight: 700,
                        py: 1.5,
                        background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                    }}
                >
                    Apply Filters
                </Button>
            </Stack>
        </Box>
    );
}

export function SearchView() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [appliedFilters, setAppliedFilters] = useState<VenueSearchFilters>({
        query: searchParams.get('query') ?? '',
        city: searchParams.get('city') ?? '',
        venueType: searchParams.get('venueType') ?? '',
        minCapacity: searchParams.get('minCapacity') ? Number(searchParams.get('minCapacity')) : undefined,
        sortBy: 'rating_desc',
    });

    const [localFilters, setLocalFilters] = useState<FilterState>({
        query: searchParams.get('query') ?? '',
        city: searchParams.get('city') ?? '',
        venueType: searchParams.get('venueType') ?? '',
        priceRange: [0, PRICE_RANGE_MAX],
        minCapacity: searchParams.get('minCapacity') ? Number(searchParams.get('minCapacity')) : '',
        sortBy: 'rating_desc',
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ['venues', 'search', appliedFilters, page],
        queryFn: () =>
            VenuePublicApiService.searchVenues({
                ...appliedFilters,
                page,
                limit: 12,
            }),
        staleTime: 30_000,
    });

    const handleApplyFilters = useCallback(() => {
        setPage(1);
        setAppliedFilters({
            query: localFilters.query,
            city: localFilters.city,
            venueType: localFilters.venueType || undefined,
            minPrice: localFilters.priceRange[0] || undefined,
            maxPrice: localFilters.priceRange[1] < PRICE_RANGE_MAX ? localFilters.priceRange[1] : undefined,
            minCapacity: localFilters.minCapacity || undefined,
            sortBy: localFilters.sortBy as VenueSearchFilters['sortBy'],
        });
        setDrawerOpen(false);
    }, [localFilters]);

    const handleReset = useCallback(() => {
        const defaultFilters: FilterState = {
            query: '',
            city: '',
            venueType: '',
            priceRange: [0, PRICE_RANGE_MAX],
            minCapacity: '',
            sortBy: 'rating_desc',
        };
        setLocalFilters(defaultFilters);
        setAppliedFilters({ sortBy: 'rating_desc' });
        setPage(1);
    }, []);

    const activeFilterCount = [
        appliedFilters.venueType,
        appliedFilters.city,
        appliedFilters.minPrice,
        appliedFilters.maxPrice,
        appliedFilters.minCapacity,
    ].filter(Boolean).length;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pb: 8 }}>
            {/* Top Search Bar */}
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    py: 2.5,
                    sticky: 'top',
                    position: 'sticky',
                    top: { xs: 64, md: 72 },
                    zIndex: 10,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}
            >
                <Container maxWidth="xl">
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1.5, sm: 2 }}
                        alignItems={{ sm: 'center' }}
                    >
                        {/* Search Input */}
                        <OutlinedInput
                            placeholder="Search venues, locations..."
                            value={localFilters.query}
                            onChange={(e) => setLocalFilters((f) => ({ ...f, query: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Iconify icon="mdi:magnify" color="text.secondary" width={22} />
                                </InputAdornment>
                            }
                            endAdornment={
                                localFilters.query && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setLocalFilters((f) => ({ ...f, query: '' }))}>
                                            <Iconify icon="mdi:close" width={16} />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                            sx={{ flex: 1, borderRadius: 3, maxWidth: { sm: 400 } }}
                        />

                        {/* Sort Select */}
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <Select
                                value={localFilters.sortBy}
                                onChange={(e) => {
                                    setLocalFilters((f) => ({ ...f, sortBy: e.target.value }));
                                    setAppliedFilters((f) => ({ ...f, sortBy: e.target.value as VenueSearchFilters['sortBy'] }));
                                }}
                                displayEmpty
                                sx={{ borderRadius: 2 }}
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Filter Toggle (mobile) / Search (desktop) */}
                        <Stack direction="row" spacing={1}>
                            {isMobile && (
                                <Button
                                    variant="outlined"
                                    onClick={() => setDrawerOpen(true)}
                                    startIcon={<Iconify icon="mdi:filter-variant" />}
                                    sx={{ borderRadius: 2, fontWeight: 600 }}
                                >
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <Box
                                            component="span"
                                            sx={{
                                                ml: 1,
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                fontSize: 11,
                                                fontWeight: 700,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {activeFilterCount}
                                        </Box>
                                    )}
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                onClick={handleApplyFilters}
                                startIcon={<Iconify icon="mdi:magnify" />}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #1877F2 0%, #8E33FF 100%)',
                                    boxShadow: 'none',
                                }}
                            >
                                Search
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    {/* Sidebar Filters (desktop) */}
                    {!isMobile && (
                        <Grid size={{ md: 3 }}>
                            <Box
                                sx={{
                                    bgcolor: 'background.paper',
                                    borderRadius: 4,
                                    p: 3,
                                    border: '1.5px solid',
                                    borderColor: 'divider',
                                    position: 'sticky',
                                    top: 180,
                                }}
                            >
                                <FiltersPanel
                                    filters={localFilters}
                                    onFiltersChange={(update) => setLocalFilters((f) => ({ ...f, ...update }))}
                                    onApply={handleApplyFilters}
                                    onReset={handleReset}
                                />
                            </Box>
                        </Grid>
                    )}

                    {/* Results */}
                    <Grid size={{ xs: 12, md: 9 }}>
                        {/* Results Header */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={1}>
                            <Box>
                                {isLoading ? (
                                    <Typography variant="body2" color="text.secondary">Searching...</Typography>
                                ) : (
                                    <Typography variant="h6" fontWeight={700}>
                                        {data?.total ?? 0} venues found
                                        {appliedFilters.query && (
                                            <Typography component="span" variant="body1" color="text.secondary" fontWeight={400}>
                                                {' '}for &ldquo;{appliedFilters.query}&rdquo;
                                            </Typography>
                                        )}
                                    </Typography>
                                )}
                            </Box>

                            {/* Active Filter Chips */}
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {appliedFilters.venueType && (
                                    <Chip
                                        label={VENUE_TYPES.find((t) => t.value === appliedFilters.venueType)?.label}
                                        size="small"
                                        onDelete={() => {
                                            setLocalFilters((f) => ({ ...f, venueType: '' }));
                                            setAppliedFilters((f) => ({ ...f, venueType: undefined }));
                                        }}
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}
                                {appliedFilters.city && (
                                    <Chip
                                        label={appliedFilters.city}
                                        size="small"
                                        onDelete={() => {
                                            setLocalFilters((f) => ({ ...f, city: '' }));
                                            setAppliedFilters((f) => ({ ...f, city: undefined }));
                                        }}
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}
                                {appliedFilters.minCapacity && (
                                    <Chip
                                        label={`${appliedFilters.minCapacity}+ guests`}
                                        size="small"
                                        onDelete={() => {
                                            setLocalFilters((f) => ({ ...f, minCapacity: '' }));
                                            setAppliedFilters((f) => ({ ...f, minCapacity: undefined }));
                                        }}
                                        color="primary"
                                        variant="outlined"
                                    />
                                )}
                            </Stack>
                        </Stack>

                        {/* Error */}
                        {isError && (
                            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                                Unable to load venues. Showing sample data.
                            </Alert>
                        )}

                        {/* Venue Grid */}
                        <Grid container spacing={3}>
                            {isLoading
                                ? Array.from({ length: 9 }).map((_, i) => (
                                    <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
                                        <VenueSearchCardSkeleton />
                                    </Grid>
                                ))
                                : (data?.data ?? []).map((venue) => (
                                    <Grid key={venue.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                                        <VenueSearchCard venue={venue} />
                                    </Grid>
                                ))
                            }
                        </Grid>

                        {/* Empty State */}
                        {!isLoading && !isError && data?.data?.length === 0 && (
                            <Box textAlign="center" py={10}>
                                <Iconify icon="mdi:map-search-outline" width={64} color="text.disabled" />
                                <Typography variant="h5" fontWeight={700} mt={2} mb={1}>
                                    No venues found
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={3}>
                                    Try adjusting your filters or searching for a different location.
                                </Typography>
                                <Button variant="outlined" onClick={handleReset} sx={{ borderRadius: 2, fontWeight: 600 }}>
                                    Clear Filters
                                </Button>
                            </Box>
                        )}

                        {/* Pagination */}
                        {data && data.totalPages > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                                <Pagination
                                    count={data.totalPages}
                                    page={page}
                                    onChange={(_, p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    color="primary"
                                    shape="rounded"
                                    size="large"
                                />
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>

            {/* Mobile Filter Drawer */}
            <Drawer
                anchor="bottom"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '24px 24px 0 0',
                        maxHeight: '90vh',
                        overflow: 'auto',
                    },
                }}
            >
                <Box sx={{ p: 3, pt: 2 }}>
                    <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'grey.300', mx: 'auto', mb: 3 }} />
                    <FiltersPanel
                        filters={localFilters}
                        onFiltersChange={(update) => setLocalFilters((f) => ({ ...f, ...update }))}
                        onApply={handleApplyFilters}
                        onReset={handleReset}
                    />
                </Box>
            </Drawer>
        </Box>
    );
}
