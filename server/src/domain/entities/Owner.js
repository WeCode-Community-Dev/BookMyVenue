class Owner {
  constructor({
    fullName,
    email,
    phone,
    password,
    role,
    businessName,
    isVerified = false,
    isAdminVerified = false ,
    isAdminApproeved = false, 
  }) {
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.businessName = businessName;
    this.isVerified = isVerified;
    this.isAdminApproeved = isAdminApproeved;
    this.isAdminVerified = isAdminVerified;
  }
}

export default Owner;