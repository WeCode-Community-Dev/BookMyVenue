"use client";

import { CalendarX, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { FormSectionCard } from "@/components/venues/create-space/form-section-card";
import { Button } from "@/components/ui/button";
import {
  formatBlockedPeriodDate,
  formatBlockedPeriodTimeRange,
} from "@/lib/data/space-manage";
import {
  getSpaceBlockedPeriods,
  removeSpaceBlockedPeriod,
  type SpaceBlockedPeriodResponse,
} from "@/services/venueServices";

import { ManageSpaceBlockPeriodDialog } from "./manage-space-block-period-dialog";

type ManageSpaceUpcomingBlocksProps = {
  spaceId: string;
  onBlocksChange?: (blocks: SpaceBlockedPeriodResponse[]) => void;
};

function getUpcomingBlocks(
  blocks: SpaceBlockedPeriodResponse[],
): SpaceBlockedPeriodResponse[] {
  const now = Date.now();
  return blocks
    .filter((block) => new Date(block.endAt).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    );
}

export function ManageSpaceUpcomingBlocks({
  spaceId,
  onBlocksChange,
}: ManageSpaceUpcomingBlocksProps) {
  const [blocks, setBlocks] = useState<SpaceBlockedPeriodResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] =
    useState<SpaceBlockedPeriodResponse | null>(null);

  const loadBlocks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getSpaceBlockedPeriods(spaceId);
      const upcoming = getUpcomingBlocks(data);
      setBlocks(upcoming);
      onBlocksChange?.(upcoming);
    } catch (error) {
      toast.error(
        (error as Error)?.message ?? "Failed to load blocked periods.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [spaceId, onBlocksChange]);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  const handleCreate = () => {
    setEditingBlock(null);
    setDialogOpen(true);
  };

  const handleEdit = (block: SpaceBlockedPeriodResponse) => {
    setEditingBlock(block);
    setDialogOpen(true);
  };

  const handleDelete = async (block: SpaceBlockedPeriodResponse) => {
    const confirmed = window.confirm(
      `Delete block on ${formatBlockedPeriodDate(block.startAt)}?`,
    );
    if (!confirmed) return;

    try {
      await removeSpaceBlockedPeriod(spaceId, block.id);
      setBlocks((prev) => {
        const next = prev.filter((item) => item.id !== block.id);
        onBlocksChange?.(next);
        return next;
      });
      toast.success("Block deleted.");
    } catch (error) {
      toast.error((error as Error)?.message ?? "Failed to delete block.");
    }
  };

  const handleSaved = (saved: SpaceBlockedPeriodResponse) => {
    setBlocks((prev) => {
      const exists = prev.some((item) => item.id === saved.id);
      const merged = exists
        ? prev.map((item) => (item.id === saved.id ? saved : item))
        : [...prev, saved];
      const next = getUpcomingBlocks(merged);
      onBlocksChange?.(next);
      return next;
    });
  };

  return (
    <>
      <FormSectionCard
        title="Upcoming Blocks"
        icon={CalendarX}
        headerAction={
          <button
            type="button"
            onClick={handleCreate}
            disabled={isLoading}
            className="inline-flex items-center gap-1 text-sm font-medium text-surface-tint hover:underline disabled:opacity-50"
          >
            <Plus className="size-4" />
            Create block
          </button>
        }
      >
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-surface-tint" />
          </div>
        ) : blocks.length === 0 ? (
          <p className="py-6 text-center text-sm text-on-surface-variant">
            No upcoming blocks. Create one when this space is unavailable.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-outline-variant/30">
            {blocks.map((block) => (
              <li
                key={block.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-[52px] flex-col items-center rounded-md bg-surface-container-low px-2 py-1.5 text-center">
                  <span className="text-[10px] font-semibold tracking-wide text-on-surface-variant uppercase">
                    {formatBlockedPeriodDate(block.startAt).split(" ")[0]}
                  </span>
                  <span className="text-lg font-bold leading-tight text-on-surface">
                    {formatBlockedPeriodDate(block.startAt).split(" ")[1]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-on-surface">
                    {block.reason || "Blocked"}
                  </p>
                  <p className="text-sm text-on-surface-variant">
                    {formatBlockedPeriodTimeRange(block.startAt, block.endAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(block)}
                    className="text-surface-tint hover:text-surface-tint"
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(block)}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </FormSectionCard>

      <ManageSpaceBlockPeriodDialog
        spaceId={spaceId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        block={editingBlock}
        onSaved={handleSaved}
      />
    </>
  );
}
