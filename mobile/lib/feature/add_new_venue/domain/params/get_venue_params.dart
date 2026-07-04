import 'package:equatable/equatable.dart';

class GetVenuesParams extends Equatable {
  const GetVenuesParams({
    required this.skip,
    required this.limit,
    this.ownerId,
  });

  final int skip;
  final int limit;
  final String? ownerId;

  @override
  List<Object> get props => <Object>[skip, limit];
}
