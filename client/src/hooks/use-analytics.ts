import { useQuery } from "@tanstack/react-query";
import { getRevenueSummary } from "@/api/analytics-api";

export const REVENUE_SUMMARY_QUERY_KEY = ["revenue-summary"];

export const useRevenueSummary = () =>
  useQuery({
    queryKey: REVENUE_SUMMARY_QUERY_KEY,
    queryFn: getRevenueSummary,
  });
