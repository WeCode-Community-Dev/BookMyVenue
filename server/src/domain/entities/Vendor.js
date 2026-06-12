class VendorEntity {
  constructor({
    id,
    fullName,
    email,
    phone,
    password,
    role,
    businessName,
    isVerified = false,
    isBlocked = false,
    isDeleted = false,
    
    
    isAdminApproved = false, 
  }) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.businessName = businessName;
    this.isVerified = isVerified;
    this.isBlocked = isBlocked;
    this.isAdminApproved = isAdminApproved;
    this.role = role;
    this.isDeleted = isDeleted;
    
  }
}

export default VendorEntity;