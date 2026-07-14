
package com.bookmyvenue.backend.service;
import com.bookmyvenue.backend.dto.venueAmenity.AmenityRequest;
import com.bookmyvenue.backend.dto.venueAmenity.AmenityResponse;
import com.bookmyvenue.backend.entity.Amenity;
import com.bookmyvenue.backend.mapper.AmenityMapper;
import com.bookmyvenue.backend.repository.AmenityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AmenityServiceImpl implements AmenityService {

    private final AmenityRepository amenityRepository;
    private final AmenityMapper mapper;

    @Override
   public AmenityResponse createAmenity(AmenityRequest request)
              {
                  Amenity amenity = Amenity.builder()
                .amenityName(request.getAmenityName())
                .description(request.getDescription())
                .isActive(request.getIsActive())
                .createdBy(1L)
                .updatedBy(1L)
                .build();

        Amenity savedAmenity = amenityRepository.save(amenity);
                  return mapper.toResponse(savedAmenity);
    }

    @Override
    public AmenityResponse getAmenityById(Long id) {

        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Amenity not found"));
        return mapper.toResponse(amenity);
    }

    @Override
    public List<AmenityResponse> getAllAmenities() {

        return amenityRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    public AmenityResponse updateAmenity(Long id,
                                            AmenityRequest request) {

        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Amenity not found"));
        amenity = Amenity.builder()
                .amenityId(amenity.getAmenityId())
                .amenityName(request.getAmenityName())
                .description(request.getDescription())
                .isActive(request.getIsActive())
                .createdAt(amenity.getCreatedAt())
                .createdBy(amenity.getCreatedBy())
                .updatedAt(java.time.LocalDateTime.now())
                .updatedBy(1L)
                .build();
         Amenity updatedAmenity =
                amenityRepository.save(amenity);
        return mapper.toResponse(updatedAmenity);
    }

    @Override
    public void deleteAmenity(Long id) {

        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Amenity not found"));

        amenityRepository.delete(amenity);
    }

}