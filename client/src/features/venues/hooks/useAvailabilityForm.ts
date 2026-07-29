import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ownerVenuesApi } from '../services/owner-venues.api';
import type { Venue, AvailabilityConfig } from '../types/venues.types';
import { useAppStore } from '@/store/app.store';
import { availabilitySchema, type AvailabilityFormValues } from '../schemas/availability.schema';

export const useAvailabilityForm = (venueId?: string) => {
  const navigate = useNavigate();
  const owner = useAppStore((state) => state.owner);

  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<AvailabilityFormValues>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      openingTime: '09:00',
      closingTime: '22:00',
      availableDays: [0, 1, 2, 3, 4, 5, 6],
      minBookingDuration: 1,
      maxBookingDuration: null,
      pricePerHour: 1000,
      bufferTime: 0,
    },
  });

  const { reset } = form;

  useEffect(() => {
    const fetchData = async () => {
      if (!venueId) return;
      try {
        setLoading(true);
        // Fetch venue details first
        const venueRes = await ownerVenuesApi.getById(venueId);
        const venueData = venueRes.data;

        if (venueData.ownerId !== owner?.userId) {
          toast.error('Unauthorized access');
          navigate('/owner/venues');
          return;
        }

        if (venueData.verificationStatus !== 'approved' || venueData.isDeleted) {
          toast.error('Venue must be approved and active to configure availability');
          navigate('/owner/venues');
          return;
        }

        setVenue(venueData);

        // Fetch existing configuration if available
        if (venueData.isAvailabilityConfigured) {
          const configRes = await ownerVenuesApi.getAvailability(venueId);
          const config = configRes.data;
          if (config) {
            reset({
              openingTime: config.openingTime,
              closingTime: config.closingTime,
              availableDays: config.availableDays,
              minBookingDuration: config.minBookingDuration,
              maxBookingDuration: config.maxBookingDuration,
              pricePerHour: config.pricePerHour,
              bufferTime: config.bufferTime,
            });
          }
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || 'Failed to load data');
        navigate('/owner/venues');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [venueId, owner?.userId, navigate, reset]);

  const onSubmit = async (data: AvailabilityFormValues) => {
    if (!venueId) return;
    try {
      setSaving(true);

      const payload: AvailabilityConfig = {
        openingTime: data.openingTime,
        closingTime: data.closingTime,
        availableDays: data.availableDays,
        minBookingDuration: data.minBookingDuration,
        maxBookingDuration: data.maxBookingDuration || null,
        pricePerHour: data.pricePerHour,
        bufferTime: data.bufferTime || 0,
      };

      if (venue?.isAvailabilityConfigured) {
        await ownerVenuesApi.updateAvailability(venueId, payload);
        toast.success('Availability updated successfully');
      } else {
        await ownerVenuesApi.createAvailability(venueId, payload);
        toast.success('Availability configured successfully');
        setVenue((prev) => (prev ? { ...prev, isAvailabilityConfigured: true } : prev));
      }

      // Navigate to owner venues listing page on success
      navigate('/owner/venues');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  return {
    venue,
    loading,
    saving,
    form,
    onSubmit,
  };
};
