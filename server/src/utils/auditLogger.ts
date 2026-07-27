import AdminAuditLog from '@/models/adminAuditLog.model';

/**
 * Helper to record administrative actions in the AdminAuditLog collection.
 */
export const logAdminAction = async (
  adminId: string,
  action: string,
  targetType: 'USER' | 'VENUE' | 'OWNER' | 'BOOKING' | 'SETTLEMENT' | 'CATEGORY',
  targetId?: string,
  reason?: string,
  metadata?: Record<string, any>
) => {
  try {
    await AdminAuditLog.create({
      adminId,
      action,
      targetType,
      targetId: targetId || '',
      reason: reason || '',
      metadata: metadata || {},
    });
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
};
