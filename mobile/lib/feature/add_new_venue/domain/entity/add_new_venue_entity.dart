import 'package:equatable/equatable.dart';

class AddNewVenueResult extends Equatable {
  const AddNewVenueResult({required this.message, required this.venue});

  final String message;
  final AddNewVenueEntity venue;

  @override
  List<Object?> get props => <Object?>[message, venue];
}

class AddNewVenueEntity extends Equatable {
  const AddNewVenueEntity({
    required this.id,
    required this.venueName,
    required this.slug,
    required this.status,
    required this.verificationStatus,
  });

  final String id;
  final String venueName;
  final String slug;
  final String status;
  final String verificationStatus;

  @override
  List<Object?> get props => <Object?>[
    id,
    venueName,
    slug,
    status,
    verificationStatus,
  ];
}
