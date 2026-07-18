import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

import '../../../../core/logger/app_logger.dart';

class MapPickerPage extends StatefulWidget {
  const MapPickerPage({super.key});

  @override
  State<MapPickerPage> createState() => _MapPickerPageState();
}

class _MapPickerPageState extends State<MapPickerPage> {
  GoogleMapController? controller;

  LatLng _selected = const LatLng(11.6700, 76.2800);

  Marker? _marker;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GoogleMap(
        initialCameraPosition: CameraPosition(target: _selected, zoom: 16),
        markers: _marker == null ? <Marker>{} : <Marker>{_marker!},
        onTap: (LatLng latLng) {
          setState(() {
            _selected = latLng;
            _marker = Marker(
              markerId: const MarkerId('selected_location'),
              position: latLng,
            );
          });
        },
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.miniStartFloat,
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          AppLogger.info('$_selected selected map result');
        },
        label: const Text('Select'),
        icon: const Icon(Icons.check),
      ),
    );
  }
}
