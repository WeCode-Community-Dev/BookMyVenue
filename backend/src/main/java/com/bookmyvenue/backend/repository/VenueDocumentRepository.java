package com.bookmyvenue.backend.repository;
import com.bookmyvenue.backend.entity.VenueDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface VenueDocumentRepository extends JpaRepository<VenueDocument, Long> {


    List<VenueDocument> findByVenueVenueId(Long venueId);
}
