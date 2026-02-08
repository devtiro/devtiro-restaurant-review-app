"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/providers/app-context-provider";
import { CreateRestaurantRequest, Photo } from "@/domain/domain";
import CreateRestaurantForm from "@/components/create-restaurant-form";
import { useState } from "react";
import axios from "axios";

type FormData = {
  name: string;
  cuisineType: string;
  contactInformation: string;
  address: {
    streetNumber: string;
    streetName: string;
    unit?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  operatingHours: {
    monday: { openTime: string; closeTime: string } | null;
    tuesday: { openTime: string; closeTime: string } | null;
    wednesday: { openTime: string; closeTime: string } | null;
    thursday: { openTime: string; closeTime: string } | null;
    friday: { openTime: string; closeTime: string } | null;
    saturday: { openTime: string; closeTime: string } | null;
    sunday: { openTime: string; closeTime: string } | null;
  };
  photos: string[];
};

export default function CreateRestaurantPage() {
  const { apiService } = useAppContext();
  const [error, setError] = useState<string | undefined>();

  const methods = useForm<FormData>({
    defaultValues: {
      name: "",
      cuisineType: "",
      contactInformation: "",
      address: {
        streetNumber: "",
        streetName: "",
        unit: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      operatingHours: {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
      photos: [],
    },
  });

  const uploadPhoto = async (file: File, caption?: string): Promise<Photo> => {
    if (null == apiService) {
      throw Error("API Service not available!");
    }
    return apiService.uploadPhoto(file, caption);
  };

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);

    try {
      const createRestaurantRequest: CreateRestaurantRequest = {
        name: data.name,
        cuisineType: data.cuisineType,
        contactInformation: data.contactInformation,
        address: data.address,
        operatingHours: data.operatingHours,
        photoIds: data.photos,
      };

      if (null == apiService) {
        throw Error("API Service not available!");
      }

      setError(undefined);

      await apiService.createRestaurant(createRestaurantRequest);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // This confirms it's an Axios error
        if (err.response?.status === 400) {
          // Extract the JSON error body
          const errorData = err.response.data?.message;
          setError(errorData);
        } else {
          // Handle other status codes
          setError(`API Error: ${err.response?.status}: ${err.response?.data}`);
        }
      } else {
        // Handle non-Axios errors
        setError(error);
      }
    }
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create a New Restaurant</h1>
      <Card>
        <CardContent className="pt-6">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <CreateRestaurantForm uploadPhoto={uploadPhoto} error={error} />
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
