export interface AdminTransaction {
  id: string;
  date: Date;
  type: string;
  bookingId: string;
  userName: string;
  ownerName: string;
  venueName: string;
  amount: number;
  status: string;
}
