import 'package:intl/intl.dart';

import '../../domain/params/add_venue_params.dart';
import '../model/request_model/add_new_venue_request/add_new_venue_request.dart';

extension AddNewVenueRequestParamsMapper on AddNewVenueRequestParams {
  AddNewVenueRequest toRequest() {
    return AddNewVenueRequest(
      venueName: venueName,
      category: category,
      description: description,
      location: location.toRequest(),
      venueSize: venueSize,
      maxCapacity: maxCapacity,
      amenityIds: amenityIds,
      coverImageUrl: coverImageUrl,
      galleryImages: galleryImages,
      virtualTourUrl: virtualTourUrl,
      slots: slots.map((VenueSlotRequestParams e) => e.toRequest()).toList(),
      services: services
          .map((VenueServiceRequestParams e) => e.toRequest())
          .toList(),
      instantBooking: instantBooking,
    );
  }
}

extension VenueLocationRequestParamsMapper on VenueLocationRequestParams {
  VenueLocationRequest toRequest() {
    return VenueLocationRequest(
      address: address,
      city: city,
      state: state,
      country: country,
      pincode: pincode,
      latitude: latitude,
      longitude: longitude,
    );
  }
}

extension VenueSlotRequestParamsMapper on VenueSlotRequestParams {
  VenueSlotRequest toRequest() {
    return VenueSlotRequest(
      slotName: slotName,
      startTime: _formatTimeTo24Hour(startTime),
      endTime: _formatTimeTo24Hour(endTime),

      price: price,
    );
  }

  String _formatTimeTo24Hour(String timeStr) {
    if (timeStr.isEmpty) {
      return '';
    }

    final String cleaned = timeStr.trim();
    final List<String> formats = <String>[
      'hh:mm a',
      'h:mm a',
      'hh:mm A',
      'h:mm A',
      'hh:mm\u00A0a',
      'hh:mm\u00A0A',
    ];

    DateTime? parsedDate;
    for (final String format in formats) {
      try {
        parsedDate = DateFormat(format, 'en_US').parse(cleaned);
        break;
      } catch (_) {}
    }

    if (parsedDate == null) {
      // Fallback manual parsing if format matching fails
      String normalized = cleaned
          .replaceAll('\u00A0', ' ')
          .replaceAll('\u202F', ' ')
          .replaceAll(RegExp(r'\s+'), ' ');

      final String upper = normalized.toUpperCase();
      if (upper.endsWith('AM') && !normalized.contains(' ')) {
        normalized = '${normalized.substring(0, normalized.length - 2)} AM';
      } else if (upper.endsWith('PM') && !normalized.contains(' ')) {
        normalized = '${normalized.substring(0, normalized.length - 2)} PM';
      }

      final List<String> parts = normalized.split(' ');
      if (parts.length == 2) {
        final String timePart = parts[0];
        final String amPm = parts[1].toUpperCase();
        final List<String> timeComponents = timePart.split(':');
        if (timeComponents.length >= 2) {
          int hour = int.tryParse(timeComponents[0]) ?? 0;
          final int minute = int.tryParse(timeComponents[1]) ?? 0;

          if (amPm == 'PM' && hour < 12) {
            hour += 12;
          } else if (amPm == 'AM' && hour == 12) {
            hour = 0;
          }

          final String hourStr = hour.toString().padLeft(2, '0');
          final String minuteStr = minute.toString().padLeft(2, '0');
          return '$hourStr:$minuteStr:00';
        }
      }
      return cleaned;
    }

    return DateFormat('HH:mm:ss').format(parsedDate);
  }
}

extension VenueServiceRequestParamsMapper on VenueServiceRequestParams {
  VenueServiceRequest toRequest() {
    return VenueServiceRequest(serviceName: serviceName, price: price);
  }
}
