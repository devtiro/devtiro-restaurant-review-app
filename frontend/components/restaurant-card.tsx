import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RestaurantSummary } from "@/domain/domain";

interface RestaurantCardProps {
  restaurant: RestaurantSummary;
}

const getImage = (restaurant: RestaurantSummary) => {
  if (
    restaurant.photos &&
    null != restaurant.photos[0] &&
    null != restaurant.photos[0].url
  ) {
    return `/api/photos/${restaurant.photos[0].url}`;
  } else {
    return null;
  }
};

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            {/* <Avatar>
              <AvatarImage src={restaurant.latestReview?.user.avatar} />
              <AvatarFallback>{restaurant.latestReview?.user.name[0]}</AvatarFallback>
            </Avatar> */}
            <div>
              <p className="font-medium">{restaurant.name}</p>
              <p className="text-sm text-muted-foreground">
                {restaurant.address.city}, {restaurant.address.country}
              </p>
            </div>
          </div>
          <div className="aspect-[4/3] relative mb-4">
            <Image
              src={
                getImage(restaurant) || "/placeholder.svg?height=300&width=400"
              }
              alt={restaurant.name}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  restaurant.averageRating && i < restaurant.averageRating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {/* {restaurant.latestReview?.content} */}
            {restaurant.cuisineType} Cuisine
          </p>
          <div className="flex justify-between border-t pt-4">
            <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
              <Heart className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
