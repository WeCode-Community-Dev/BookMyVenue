export interface Venue {
  id: number;
  owner_id: number;
  name: string;
  category: string;
  description: string | null;
  address: string;
  city: string;
  capacity: number;
  base_price: number;
  approval_status: "pending" | "approved" | "rejected";
  is_active: boolean;
  created_at: string;
  updated_at: string;
  thumbnail: string | null;
}