export const UserMessage = {
    success: {
        USER_FETCHED: "Users fetched successfully",
        USER_BLOCKED: "User blocked successfully",
        USER_UNBLOCKED: "User unblocked successfully",

        OTP_SENT: "OTP sent successfully",
        OTP_RESENT: "OTP resent successfully",
        EMAIL_UPDATED: "Email updated successfully",
        PROFILE_UPDATED: "Profile updated successfully",
        PROFILE_IMAGE_UPDATED: "Profile image updated successfully",
        PROFILE_IMAGE_REMOVED: "Profile image removed successfully",
        ACCOUNT_DEACTIVATED: "Account deactivated successfully",
        ACCOUNT_ACTIVATED: "Account activated successfully",
        WISHLIST_ADDED: "Venue added to wishlist successfully",
        WISHLIST_REMOVED: "Venue removed from wishlist successfully",
        PROFILE_FETCHED: "Profile fetched successfully",
        WISHLIST_FETCHED: "Wishlist fetched successfully",
        PASSWORD_CHANGED:"Password changed successfully",
    },

    error: {
        USER_NOT_FOUND: "User not found",
        USER_ALREADY_BLOCKED: "User already blocked",
        USER_ALREADY_ACTIVE: "User already active",

        USER_BLOCKED_EMAIL_CHANGE: "Blocked users cannot change email",
        EMAIL_ALREADY_EXISTS: "Email already exists",
        EMAIL_SAME_AS_CURRENT: "New email cannot be the same as the current email",
        EMAIL_CHANGE_REQUEST_NOT_FOUND: "No email change request found",
        OTP_NOT_FOUND: "OTP not found",
        OTP_EXPIRED: "OTP has expired",
        INVALID_OTP: "Invalid OTP",
        USER_ACCOUNT_BLOCKED: "User account is blocked",
        USER_BLOCKED_REMOVE_PROFILE_IMAGE: "Blocked users cannot remove profile image",
        PROFILE_IMAGE_NOT_FOUND: "No profile image found",
        USER_BLOCKED_UPDATE_PROFILE_IMAGE:"Blocked users cannot update profile image",
        PROFILE_IMAGE_REQUIRED:"Profile image is required",
        WISHLIST_ALREADY_EXISTS:"Venue already exists in wishlist",
        WISHLIST_NOT_FOUND: "Venue not found in wishlist",
        USER_BLOCKED_UPDATE_ACCOUNT_STATUS:"Blocked users cannot update account status",
        ACCOUNT_ALREADY_ACTIVE: "Account is already active",
        ACCOUNT_ALREADY_INACTIVE: "Account is already inactive",
        INVALID_CURRENT_PASSWORD:"Current password is incorrect",
        PASSWORD_MISMATCH:"New password and confirm password do not match",
        SAME_PASSWORD:"New password cannot be the same as the current password",
        
    }
};