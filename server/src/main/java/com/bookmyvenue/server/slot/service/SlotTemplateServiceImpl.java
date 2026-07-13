package com.bookmyvenue.server.slot.service;

import com.bookmyvenue.server.auth.service.AuthenticatedUserService;
import com.bookmyvenue.server.common.exception.BusinessException;
import com.bookmyvenue.server.common.exception.ErrorCode;
import com.bookmyvenue.server.slot.dto.request.CreateSlotTemplateRequest;
import com.bookmyvenue.server.slot.dto.response.SlotTemplateResponse;
import com.bookmyvenue.server.slot.entity.SlotTemplate;
import com.bookmyvenue.server.slot.repository.SlotTemplateRepository;
import com.bookmyvenue.server.user.entity.User;
import com.bookmyvenue.server.venue.entity.Venue;
import com.bookmyvenue.server.venue.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SlotTemplateServiceImpl
        implements SlotTemplateService {

    private final SlotTemplateRepository slotTemplateRepository;
    private final VenueRepository venueRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @Override
    public SlotTemplateResponse createTemplate(
            Long venueId,
            CreateSlotTemplateRequest request
    ) {

        log.info("Creating slot template for venueId={}", venueId);

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> {
                    log.warn("Venue not found. venueId={}", venueId);
                    return new BusinessException(ErrorCode.VENUE_NOT_FOUND);
                });

        User currentUser =
                authenticatedUserService.getCurrentUser();

        if (!venue.getOwner().getId().equals(currentUser.getId())) {

            log.warn(
                    "Unauthorized slot template creation attempt. venueId={}, userId={}",
                    venueId,
                    currentUser.getId()
            );

            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        if (!request.endTime().isAfter(request.startTime())) {

            log.warn(
                    "Invalid time range. startTime={}, endTime={}",
                    request.startTime(),
                    request.endTime()
            );
            throw new BusinessException(ErrorCode.INVALID_TIME_RANGE);
        }

        List<SlotTemplate> existingTemplates =
                slotTemplateRepository.findByVenueIdAndDayOfWeek(
                        venueId,
                        request.dayOfWeek()
                );

        // Ensure the new slot does not overlap with any existing slot
        // for the same venue and day of the week.
        boolean hasOverlap = existingTemplates.stream()
                .anyMatch(template ->
                        request.startTime().isBefore(template.getEndTime())
                                && request.endTime().isAfter(template.getStartTime())
                );

        if (hasOverlap) {

            log.warn(
                    "Overlapping slot template detected. venueId={}, day={}, startTime={}, endTime={}",
                    venueId,
                    request.dayOfWeek(),
                    request.startTime(),
                    request.endTime()
            );

            throw new BusinessException(
                    ErrorCode.OVERLAPPING_SLOT_TEMPLATE
            );
        }

        SlotTemplate slotTemplate =
                SlotTemplate.builder()
                        .venue(venue)
                        .dayOfWeek(request.dayOfWeek())
                        .startTime(request.startTime())
                        .endTime(request.endTime())
                        .active(true)
                        .build();

        slotTemplateRepository.save(slotTemplate);

        log.info(
                "Slot template created successfully. templateId={}, venueId={}",
                slotTemplate.getId(),
                venueId
        );

        return new SlotTemplateResponse(
                slotTemplate.getId(),
                slotTemplate.getDayOfWeek(),
                slotTemplate.getStartTime(),
                slotTemplate.getEndTime(),
                slotTemplate.isActive()
        );
    }

    @Override
    public List<SlotTemplateResponse> getVenueTemplates(
            Long venueId
    ) {

        log.info(
                "Fetching slot templates for venueId={}",
                venueId
        );
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.VENUE_NOT_FOUND));

        User currentUser = authenticatedUserService.getCurrentUser();

        if (!venue.getOwner().getId().equals(currentUser.getId())) {
            log.warn(
                    "Unauthorized slot template access. venueId={}, userId={}",
                    venueId,
                    currentUser.getId()
            );
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        log.info(
                "Successfully fetched slot templates for venueId={}",
                venueId
        );
        return slotTemplateRepository.findByVenueId(venueId)
                .stream()
                .map(template ->
                        new SlotTemplateResponse(
                                template.getId(),
                                template.getDayOfWeek(),
                                template.getStartTime(),
                                template.getEndTime(),
                                template.isActive()
                        )
                )
                .toList();
    }

    @Override
    public void deleteTemplate(Long templateId) {

        log.info(
                "Deleting slot template. templateId={}",
                templateId
        );

        SlotTemplate template =
                slotTemplateRepository.findById(templateId)
                        .orElseThrow(() -> {
                            log.warn(
                                    "Slot template not found. templateId={}",
                                    templateId
                            );
                            return new BusinessException(
                                    ErrorCode.SLOT_TEMPLATE_NOT_FOUND
                            );
                        });

        User currentUser =
                authenticatedUserService.getCurrentUser();

        if (!template.getVenue()
                .getOwner()
                .getId()
                .equals(currentUser.getId())) {

            log.warn(
                    "Unauthorized slot template deletion attempt. templateId={}, userId={}",
                    templateId,
                    currentUser.getId()
            );

            throw new BusinessException(
                    ErrorCode.ACCESS_DENIED
            );
        }

        slotTemplateRepository.delete(template);

        log.info(
                "Slot template deleted successfully. templateId={}",
                templateId
        );
    }
}
