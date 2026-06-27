export class VendorEntity {
  constructor({
    id,
    fullName,
    email,
    phone,
    password,
    profileImage = {
      publicId: "",
      url: ""
    },
    companyName = "",
    address = {
      addressLine1: "",
      city: "",
      state: "",
      pincode: ""
    },
    bio = "",
    role,
    businessName,
    isVerified = false,
    isBlocked = false,
    isDeleted = false,
    approvalStatus,
    rejectionReason,
  }) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.profileImage = profileImage;
    this.companyName = companyName;
    this.address = address;
    this.bio = bio;
    this.role = role;
    this.businessName = businessName;
    this.isVerified = isVerified;
    this.isBlocked = isBlocked;
    this.isDeleted = isDeleted;
    this.approvalStatus = approvalStatus;
    this.rejectionReason = rejectionReason;

  }
}
