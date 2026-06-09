class Admin {
  constructor({
    fullName,
    email,
    password,
    permissions = [],
  }) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.permissions = permissions;
  }
}

export default Admin;