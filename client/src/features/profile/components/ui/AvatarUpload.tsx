import React from 'react';
import { User as UserIcon, Camera } from 'lucide-react';

interface AvatarUploadProps {
  avatarPreview: string;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  avatarPreview,
  avatarInputRef,
  onAvatarChange,
}) => {
  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-border bg-muted/20 flex items-center justify-center">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-12 h-12 text-foreground/30" />
          )}
        </div>
        <button
          type="button"
          onClick={() => avatarInputRef.current?.click()}
          className="absolute bottom-0 right-0 p-2.5 rounded-full bg-primary text-white border-2 border-surface shadow-md hover:bg-accent transition-all duration-200 cursor-pointer"
          aria-label="Upload Avatar"
        >
          <Camera size={16} />
        </button>
        <input
          type="file"
          ref={avatarInputRef}
          onChange={onAvatarChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      <div>
        <h4 className="text-base sm:text-lg font-semibold text-foreground">Profile Picture</h4>
        <p className="text-sm text-foreground/50 mt-1">JPG, PNG or GIF. Max 5MB.</p>
      </div>
    </div>
  );
};

export default AvatarUpload;
