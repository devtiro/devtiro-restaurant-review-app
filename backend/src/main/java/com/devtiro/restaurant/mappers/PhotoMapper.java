package com.devtiro.restaurant.mappers;

import com.devtiro.restaurant.domain.dtos.PhotoDto;
import com.devtiro.restaurant.domain.entities.Photo;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PhotoMapper {

    PhotoDto toDto(Photo photo);

}
