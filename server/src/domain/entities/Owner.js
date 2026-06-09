class Owner {
  constructor({
    fullName,
    email,
    phone,
    password,
    role,
    businessName,
    isVerified = false,
    isAminVerified = false  
  }) {
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.businessName = businessName;
    this.isVerified = isVerified;
  }
}

export default Owner;