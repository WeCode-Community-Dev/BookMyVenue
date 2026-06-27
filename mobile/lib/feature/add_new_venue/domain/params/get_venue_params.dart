import 'package:equatable/equatable.dart';

class GetVenuesParams extends Equatable {
  const GetVenuesParams({required this.skip, required this.limit});

  final int skip;
  final int limit;

  @override
  List<Object> get props => <Object>[skip, limit];
}
