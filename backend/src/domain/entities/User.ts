export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "VENUE_OWNER" | "CUSTOMER";
  createdAt: Date;
}
