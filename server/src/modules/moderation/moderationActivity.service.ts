import {
  ModerationActivityModel,
  type ModerationActionType,
  type ModerationLogLean,
} from './moderationActivity.model';
import type mongoose from 'mongoose';
import { logError } from '../../utils/logger';

export async function logModerationAction(
  adminId: string | mongoose.Types.ObjectId,
  action: ModerationActionType,
  targetId: string,
  targetType: 'user' | 'venue' | 'review',
  reason?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await ModerationActivityModel.create({
      adminId,
      action,
      targetId,
      targetType,
      reason,
      metadata,
    });
  } catch (error) {
    // Log the error but don't fail the primary moderation action
    logError('Failed to log moderation activity', {
      module: 'moderationActivity.service',
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
      .populate('adminId', 'username email')
      .lean()
      .exec() as unknown as Promise<ModerationLogLean[]>,
    ModerationActivityModel.countDocuments(),
  ]);

  return { logs, total };
}
