package com.devtiro.restaurant.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RestaurantDto {

    private String id;

    private String name;

    private String cuisineType;

    private String contactInformation;

    private Float averageRating;

    private GeoPointDto geoLocation;

    private AddressDto address;

    private OperatingHoursDto operatingHours;

    private List<PhotoDto> photos = new ArrayList<>();

    private List<ReviewDto> reviews = new ArrayList<>();

    private UserDto createdBy;

    private Integer totalReviews;
}
