class Owner {
  constructor({
    fullName,
    email,
    phone,
    password,
    businessName,
    isVerified = false,
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