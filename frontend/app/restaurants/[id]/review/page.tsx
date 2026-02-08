"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Star, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppContext } from "@/providers/app-context-provider";
import { Photo } from "@/domain/domain";

export default function WriteReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewId = searchParams.get("reviewId");
  const isEditing = !!reviewId;

  const { apiService } = useAppContext();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<Photo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviewData = async () => {
      if (isEditing && apiService) {
        try {
          const review = await apiService.getRestaurantReview(
            params.id,
            reviewId,
          );

          if (review) {
            setRating(review.rating);
            setContent(review.content);
            if (review.photos) {
              setExistingPhotos(review.photos);
              setPreviews(
                review.photos.map((photo) => `/api/photos/${photo.url}`),
              );
            }
          }
        } catch (error) {
          console.error("Error fetching review data:", error);
        }
      }
    };

    fetchReviewData();
  }, [isEditing, reviewId, params.id, apiService]);

  const uploadPhoto = async (file: File, caption?: string): Promise<string> => {
    if (!apiService) {
      throw Error("API Service not available!");
    }
    // Upload the photo and return the URL which is used as the ID
    const response = await apiService.uploadPhoto(file, caption);
    return response.url; // Return just the URL string which serves as the ID
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    // Create preview URLs for the images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiService) {
      throw Error("API Service not available!");
    }
    
    try {
      setIsSubmitting(true);
      
      // Upload all new images and get the URLs directly (which serve as IDs)
      const newPhotoIds = await Promise.all(
        images.map((file) => uploadPhoto(file))
      );
      
      // Get IDs from existing photos (which are URLs)
      const existingPhotoIds = existingPhotos.map((photo) => photo.url);
      const allPhotoIds = [...existingPhotoIds, ...newPhotoIds];

      const reviewData = {
        content: content,
        rating: rating,
        photoIds: allPhotoIds,
      };

      if (isEditing) {
        await apiService.updateReview(params.id, reviewId, reviewData);
      } else {
        await apiService.createReview(params.id, reviewData);
      }

      // Redirect back to restaurant page after submission
      router.push(`/restaurants/${params.id}`);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePhoto = (index: number) => {
    if (index < existingPhotos.length) {
      // Remove an existing photo
      setExistingPhotos((current) => current.filter((_, i) => i !== index));
      setPreviews((current) => current.filter((_, i) => i !== index));
    } else {
      // Remove a newly added photo
      const adjustedIndex = index - existingPhotos.length;
      setImages((current) => current.filter((_, i) => i !== adjustedIndex));
      setPreviews((current) => current.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Review" : "Write a Review"}</CardTitle>
          <CardDescription>
            Share your dining experience at this restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        i < (hoveredRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Tell us about your experience at this restaurant..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Photos</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square group">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {previews.length < 8 && (
                  <label className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Upload photos
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                You can upload up to 8 photos
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/restaurants/${params.id}`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!rating || !content || isSubmitting}
              >
                {isSubmitting 
                  ? "Uploading..." 
                  : isEditing 
                    ? "Update Review" 
                    : "Submit Review"
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}