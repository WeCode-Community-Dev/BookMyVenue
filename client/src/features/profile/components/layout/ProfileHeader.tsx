import React from 'react';

const ProfileHeader: React.FC = () => {
  return (
    <div className="mb-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
        Account Settings
      </h1>
      <p className="mt-2 text-sm sm:text-base text-foreground/60">
        Manage your personal details, credentials, and venue owner onboarding details.
      </p>
    </div>
  );
};

export default ProfileHeader;
