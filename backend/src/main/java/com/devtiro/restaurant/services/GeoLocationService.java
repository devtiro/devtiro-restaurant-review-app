package com.devtiro.restaurant.services;

import com.devtiro.restaurant.domain.GeoLocation;
import com.devtiro.restaurant.domain.entities.Address;

public interface GeoLocationService {
    GeoLocation geoLocate(Address address);
}
