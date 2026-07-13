package com.bookmyvenue.server.slot.repository;

import com.bookmyvenue.server.slot.entity.SlotTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface SlotTemplateRepository extends JpaRepository<SlotTemplate,Long> {
List<SlotTemplate> findByVenueId(Long venueId);

List<SlotTemplate> findByVenueIdAndDayOfWeek(
        Long venueId,
        DayOfWeek dayOfWeek
);
}
