export interface MonthData {
  year: string;
  month: string;
  revenue: number;
  count: number;
}

export interface AnalyticsResponse {
  months: MonthData[];
}
