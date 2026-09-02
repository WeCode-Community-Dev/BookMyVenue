import {
  ModerationActivityModel,
  type ModerationActionType,
  type ModerationActorRole,
  type ModerationLogLean,
} from './moderationActivity.model';
import type mongoose from 'mongoose';
import { logError } from '../../utils/logger';

interface LogActionOptions {
  actorId?: string | mongoose.Types.ObjectId;
  actorRole?: ModerationActorRole;
  reason?: string;
  metadata?: Record<string, unknown>;
}

// Never throws: a logging failure must not roll back the action it describes
export async function logModerationAction(
  action: ModerationActionType,
  targetId: string,
  targetType: 'user' | 'venue' | 'review',
  options: LogActionOptions = {}
): Promise<void> {
  const { actorId, actorRole = 'admin', reason, metadata } = options;

  try {
    await ModerationActivityModel.create({
      actorId,
      actorRole,
      action,
      targetId,
      targetType,
      reason,
      metadata,
    });
  } catch (error) {
    logError('Failed to log moderation activity', {
      module: 'moderationActivity.service',
      action,
      targetId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function getModerationLogs(
  page: number,
  limit: number
): Promise<{ logs: ModerationLogLean[]; total: number }> {
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    ModerationActivityModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('actorId', 'username email')
      .lean()
      .exec() as unknown as Promise<ModerationLogLean[]>,
    ModerationActivityModel.countDocuments(),
  ]);

  return { logs, total };
}

// Scoped by target, so the owner sees admin and system steps alongside their own
export async function getVenueActivityLogs(
  venueId: string,
  page: number,
  limit: number
): Promise<{ logs: ModerationLogLean[]; total: number }> {
  const skip = (page - 1) * limit;
  const filter = { targetType: 'venue' as const, targetId: venueId };

  const [logs, total] = await Promise.all([
    ModerationActivityModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('actorId', 'username email')
      .lean()
      .exec() as unknown as Promise<ModerationLogLean[]>,
    ModerationActivityModel.countDocuments(filter),
  ]);

  return { logs, total };
}
