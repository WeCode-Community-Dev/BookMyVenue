import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { changePassword } from '@/services/authService';
import { extractErrorMessage } from '@/utils/toast';
import Spinner from '@/components/common/Spinner';

const SecurityCard = () => {
  const { clearSession } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setExpanded(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(oldPassword, newPassword);
      clearSession();
      navigate('/login', { replace: true });
      toast.success('Password changed. Please sign in again.');
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
          <FiLock className="text-[var(--text-secondary)]" />
          Password
        </div>
        {!expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-sm font-medium text-[var(--bg-green)] hover:underline cursor-pointer"
          >
            Change password
          </button>
        )}
      </div>

      {expanded && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="password"
            placeholder="Current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            disabled={submitting}
            className="w-full rounded-lg border border-[var(--bg-grey)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--bg-green)] disabled:opacity-50"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={submitting}
            className="w-full rounded-lg border border-[var(--bg-grey)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--bg-green)] disabled:opacity-50"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={submitting}
            className="w-full rounded-lg border border-[var(--bg-grey)] bg-[var(--bg-primary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--bg-green)] disabled:opacity-50"
          />
          <p className="text-xs text-[var(--text-secondary)]">
            Changing your password signs you out of every device, including this one.
          </p>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {submitting && <Spinner size="h-3.5 w-3.5" />}
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={submitting}
              className="px-4 py-2 rounded-xl border border-[var(--bg-grey)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-grey)]/30 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SecurityCard;
