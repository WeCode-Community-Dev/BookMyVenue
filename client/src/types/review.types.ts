export interface Review {
  _id: string;
  customer: { _id: string; name: string } | null;
  rating: number;
  comment: string;
  createdAt: string;
}
