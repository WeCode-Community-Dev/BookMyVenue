package com.bookmyvenue.server.slot.service;

import com.bookmyvenue.server.slot.dto.request.CreateSlotTemplateRequest;
import com.bookmyvenue.server.slot.dto.response.SlotTemplateResponse;

import java.util.List;

public interface SlotTemplateService {

    SlotTemplateResponse createTemplate(
            Long venueId,
            CreateSlotTemplateRequest request
    );

    List<SlotTemplateResponse> getVenueTemplates(
            Long venueId
    );

    void deleteTemplate(
            Long templateId
    );
}