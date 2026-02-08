"use client";

import {
  CreateRestaurantRequest,
  CreateReviewRequest,
  PaginatedResponse,
  Photo,
  Restaurant,
  RestaurantSearchParams,
  RestaurantSummary,
  Review,
  UpdateRestaurantRequest,
  UpdateReviewRequest,
} from "@/domain/domain";

// API Service interface
export interface ApiService {
  // Restaurant endpoints
  searchRestaurants(
    params: RestaurantSearchParams,
  ): Promise<PaginatedResponse<RestaurantSummary>>;

  getRestaurant(restaurantId: string): Promise<Restaurant>;

  createRestaurant(request: CreateRestaurantRequest): Promise<Restaurant>;

  updateRestaurant(
    restaurantId: string,
    request: UpdateRestaurantRequest,
  ): Promise<void>;

  deleteRestaurant(restaurantId: string): Promise<void>;

  // Review endpoints
  getRestaurantReviews(
    restaurantId: string,
    sort?: "datePosted,desc" | "datePosted,asc" | "rating,desc" | "rating,asc",
    page?: number,
    size?: number,
  ): Promise<PaginatedResponse<Review>>;
  getRestaurantReview(restaurantId: string, reviewId: string): Promise<Review>;
  createReview(
    restaurantId: string,
    request: CreateReviewRequest,
  ): Promise<Review>;
  updateReview(
    restaurantId: string,
    reviewId: string,
    request: UpdateReviewRequest,
  ): Promise<void>;

  deleteReview(restaurantId: string, reviewId: string): Promise<void>;

  // Photo endpoint
  uploadPhoto(file: File, caption?: string): Promise<Photo>;
}
