package com.devtiro.restaurant.mappers;

import com.devtiro.restaurant.domain.ReviewCreateUpdateRequest;
import com.devtiro.restaurant.domain.dtos.ReviewCreateUpdateRequestDto;
import com.devtiro.restaurant.domain.dtos.ReviewDto;
import com.devtiro.restaurant.domain.entities.Review;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReviewMapper {

    ReviewCreateUpdateRequest toReviewCreateUpdateRequest(ReviewCreateUpdateRequestDto dto);

    ReviewDto toDto(Review review);

}
