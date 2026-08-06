"use client";

import { Clock, Loader2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { FormSectionCard } from "@/components/venues/create-space/form-section-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  createDefaultOperatingHours,
  DEFAULT_OPERATING_HOURS,
  type OperatingHourRow,
  WEEKDAY_LABELS,
} from "@/lib/data/space-manage";
import {
  createSpaceOperatingHours,
  getSpaceOperatingHours,
} from "@/services/venueServices";

type ManageSpaceBusinessHoursProps = {
  spaceId: string;
  onHoursChange?: (hours: OperatingHourRow[]) => void;
};

function mergeOperatingHours(
  apiHours: Awaited<ReturnType<typeof getSpaceOperatingHours>>,
): OperatingHourRow[] {
  const defaults = createDefaultOperatingHours();
  return defaults.map((defaultRow) => {
    const saved = apiHours.find((h) => h.weekday === defaultRow.weekday);
    if (!saved) {
      return defaultRow;
    }
    return {
      weekday: saved.weekday,
      openTime: saved.openTime,
      closeTime: saved.closeTime,
      isClosed: saved.isClosed,
    };
  });
}

function isValidOpenDay(row: OperatingHourRow): boolean {
  if (row.isClosed) return true;
  const [openH, openM] = row.openTime.split(":").map(Number);
  const [closeH, closeM] = row.closeTime.split(":").map(Number);
  return closeH * 60 + closeM > openH * 60 + openM;
}

export function ManageSpaceBusinessHours({
  spaceId,
  onHoursChange,
}: ManageSpaceBusinessHoursProps) {
  const [hours, setHours] = useState<OperatingHourRow[]>(
    createDefaultOperatingHours(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadHours = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getSpaceOperatingHours(spaceId);
      const merged = mergeOperatingHours(data);
      setHours(merged);
      onHoursChange?.(merged);
    } catch (error) {
      toast.error(
        (error as Error)?.message ?? "Failed to load business hours.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [spaceId, onHoursChange]);

  useEffect(() => {
    loadHours();
  }, [loadHours]);

  const updateRow = (weekday: number, patch: Partial<OperatingHourRow>) => {
    setHours((prev) => {
      const next = prev.map((row) =>
        row.weekday === weekday ? { ...row, ...patch } : row,
      );
      onHoursChange?.(next);
      return next;
    });
  };

  const handleCopyToWeekdays = () => {
    const monday = hours.find((row) => row.weekday === 1);
    if (!monday) return;
    setHours((prev) => {
      const next = prev.map((row) => {
        if (row.weekday >= 2 && row.weekday <= 5) {
          return {
            ...row,
            openTime: monday.openTime,
            closeTime: monday.closeTime,
            isClosed: monday.isClosed,
          };
        }
        return row;
      });
      onHoursChange?.(next);
      return next;
    });
    toast.success("Monday schedule copied to weekdays.");
  };

  const handleClearDay = (weekday: number) => {
    updateRow(weekday, {
      isClosed: true,
      openTime: DEFAULT_OPERATING_HOURS.openTime,
      closeTime: DEFAULT_OPERATING_HOURS.closeTime,
    });
  };

  const handleSave = async () => {
    const invalidDay = hours.find((row) => !isValidOpenDay(row));
    if (invalidDay) {
      toast.error(
        `${WEEKDAY_LABELS[invalidDay.weekday]} close time must be after open time.`,
      );
      return;
    }

    try {
      setIsSaving(true);
      await createSpaceOperatingHours(spaceId, {
        hours: hours.map(({ weekday, openTime, closeTime, isClosed }) => ({
          weekday,
          openTime,
          closeTime,
          isClosed,
        })),
      });
      toast.success("Business hours saved.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ?? "Failed to save business hours.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormSectionCard
      title="Business Hours"
      icon={Clock}
      // headerAction={
      //   <button
      //     type="button"
      //     onClick={handleCopyToWeekdays}
      //     disabled={isLoading}
      //     className="text-sm font-medium text-surface-tint hover:underline disabled:opacity-50"
      //   >
      //     Copy to Weekdays
      //   </button>
      // }
    >
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-surface-tint" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {hours.map((row) => {
              const isOpen = !row.isClosed;
              return (
                <div
                  key={row.weekday}
                  className="flex flex-wrap items-center gap-3 sm:flex-nowrap"
                >
                  <Checkbox
                    checked={isOpen}
                    onCheckedChange={(checked) =>
                      updateRow(row.weekday, { isClosed: !checked })
                    }
                    aria-label={`${WEEKDAY_LABELS[row.weekday]} open`}
                  />
                  <span className="w-24 shrink-0 text-sm font-medium text-on-surface">
                    {WEEKDAY_LABELS[row.weekday]}
                  </span>
                  <div className="flex flex-1 items-center gap-2">
                    <Input
                      type="time"
                      value={row.openTime}
                      disabled={!isOpen}
                      onChange={(e) =>
                        updateRow(row.weekday, { openTime: e.target.value })
                      }
                      className="w-32"
                    />
                    <span className="text-on-surface-variant">to</span>
                    <Input
                      type="time"
                      value={row.closeTime}
                      disabled={!isOpen}
                      onChange={(e) =>
                        updateRow(row.weekday, { closeTime: e.target.value })
                      }
                      className="w-32"
                    />
                  </div>
                  {/* <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleClearDay(row.weekday)}
                    aria-label={`Clear ${WEEKDAY_LABELS[row.weekday]}`}
                    className="text-on-surface-variant hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button> */}
                </div>
              );
            })}
          </div>
          <div className="-mx-5 -mb-4 mt-6 flex justify-end border-t border-outline-variant/30 bg-surface-container-low px-5 py-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-surface-tint text-on-primary hover:bg-surface-tint/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Schedule"
              )}
            </Button>
          </div>
        </>
      )}
    </FormSectionCard>
  );
}
