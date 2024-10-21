import { ReviewMapQueryOptions, ReviewQueryOptions, ReviewsOutput } from "@/types";
import { useQuery } from "react-query";
import { API_ENDPOINTS } from "./client/api-endpoints";
import client from "./client";

export function useMapReviews(options?: Partial<ReviewMapQueryOptions>) {
    const {
      data: response,
      isLoading,
      error,
    } = useQuery<ReviewsOutput, Error>(
      [API_ENDPOINTS.MAP_REVIEWS, options],
      ({ queryKey }) =>
        client.mapReviews.get(Object.assign({}, queryKey[1] as ReviewMapQueryOptions)),
      {
        keepPreviousData: true,
      },
    );
    return {
      reviewData: response,
      isLoading,
      error
    };
  }