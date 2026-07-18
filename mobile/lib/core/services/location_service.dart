import 'package:geocoding/geocoding.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../../feature/add_new_venue/presentation/bloc/cubit/venue_details_cubit.dart';

class LocationService {
  Future<VenueLocationState> reverseGeocode(LatLng loc) async {
    final List<Placemark> places = await placemarkFromCoordinates(
      loc.latitude,
      loc.longitude,
    );

    final Placemark p = places.first;

    return VenueLocationState(
      address: '${p.street}, ${p.subLocality}',
      city: p.locality ?? '',
      state: p.administrativeArea ?? '',
      country: p.country ?? '',
      pincode: p.postalCode ?? '',
      latitude: loc.latitude,
      longitude: loc.longitude,
    );
  }
}
