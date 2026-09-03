import { useRef, useState } from 'react';
import { FiUser, FiCamera, FiCheck, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { updateProfile, deleteProfilePicture } from '@/services/userService';
import { useToast } from '@/hooks/useToast';
import { extractErrorMessage } from '@/utils/toast';
import ImageLightbox from '@/components/common/ImageLightbox';
import AvatarCropEditor from '@/components/common/AvatarCropEditor';
import Spinner from '@/components/common/Spinner';

const IdentityCard = () => {
  const { user, updateUser } = useAuth();
  const { uploadAvatar } = useAvatarUpload();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.username ?? '');
  const [savingName, setSavingName] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
  };

  const closeCropEditor = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const handleCropSave = async (croppedFile: File) => {
    setSavingAvatar(true);
    try {
      const publicId = await uploadAvatar(croppedFile);
      try {
        const profile = await updateProfile({ profilePicturePublicId: publicId });
        updateUser({ profilePicture: profile.profilePicture });
        toast.success('Profile picture updated');
        closeCropEditor();
      } catch (error) {
        toast.error(extractErrorMessage(error) || 'Failed to save profile picture');
      }
    } catch {
      // useAvatarUpload already has its own error toast for thee upload step
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    if (!window.confirm('Remove your profile picture?')) return;

    setDeleting(true);
    try {
      await deleteProfilePicture();
      updateUser({ profilePicture: undefined });
      toast.success('Profile picture removed');
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'Failed to remove profile picture');
    } finally {
      setDeleting(false);
    }
  };

  const startEditingName = () => {
    setNameDraft(user?.username ?? '');
    setEditingName(true);
  };

  const cancelEditingName = () => setEditingName(false);

  const saveName = async () => {
    if (savingName) return;
    const trimmed = nameDraft.trim();
    if (!trimmed || trimmed === user?.username) {
      setEditingName(false);
      return;
    }

    setSavingName(true);
    try {
      const profile = await updateProfile({ username: trimmed });
      updateUser({ username: profile.name });
      toast.success('Name updated');
      setEditingName(false);
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'Failed to update name');
    } finally {
      setSavingName(false);
    }
  };

  return (
    <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-2xl p-5 flex items-center gap-4">
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => user?.profilePicture && setViewerOpen(true)}
          aria-label={user?.profilePicture ? 'View profile picture' : undefined}
          className="w-16 h-16 rounded-full border-2 border-[var(--bg-grey)] bg-[var(--bg-grey)] overflow-hidden flex items-center justify-center text-[var(--text-secondary)] cursor-pointer"
        >
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile picture"
              className="w-full h-full object-cover"
            />
          ) : (
            <FiUser className="text-2xl" />
          )}
        </button>
        <button
          type="button"
          onClick={handleAvatarClick}
          disabled={deleting}
          aria-label="Change profile picture"
          className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[var(--bg-green)] text-white flex items-center justify-center hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
        >
          <FiCamera className="text-xs" />
        </button>
        {user?.profilePicture && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Remove profile picture"
            className="absolute -top-0.5 -right-0.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {deleting ? <Spinner size="h-3 w-3" /> : <FiTrash2 className="text-xs" />}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="min-w-0 flex-1">
        {editingName ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
              disabled={savingName}
              className="min-w-0 flex-1 rounded-lg border border-[var(--bg-grey)] bg-[var(--bg-primary)] px-2 py-1 text-sm font-semibold text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--bg-green)] disabled:opacity-50"
            />
            <button
              type="button"
              onClick={saveName}
              disabled={savingName}
              aria-label="Save name"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--bg-green)] hover:bg-[var(--bg-grey)]/30 transition cursor-pointer shrink-0 disabled:opacity-50"
            >
              {savingName ? <Spinner size="h-3.5 w-3.5" /> : <FiCheck />}
            </button>
            <button
              type="button"
              onClick={cancelEditingName}
              disabled={savingName}
              aria-label="Cancel"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-grey)]/30 transition cursor-pointer shrink-0 disabled:opacity-50"
            >
              <FiX />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-[var(--text-primary)] truncate">{user?.username}</h2>
            <button
              type="button"
              onClick={startEditingName}
              aria-label="Edit name"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer shrink-0"
            >
              <FiEdit2 className="text-xs" />
            </button>
          </div>
        )}
        <p className="text-sm text-[var(--text-secondary)] truncate">{user?.email}</p>
      </div>

      {viewerOpen && user?.profilePicture && (
        <ImageLightbox images={[user.profilePicture]} onClose={() => setViewerOpen(false)} />
      )}

      {cropSrc && (
        <AvatarCropEditor
          imageSrc={cropSrc}
          onCancel={closeCropEditor}
          onSave={handleCropSave}
          isSaving={savingAvatar}
        />
      )}
    </div>
  );
};

export default IdentityCard;
