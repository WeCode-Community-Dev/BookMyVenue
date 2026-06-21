import 'package:equatable/equatable.dart';

abstract class UseCase<ReturnType, Params> {
  ReturnType call(Params params);
}

class NoParams extends Equatable {
  const NoParams();

  @override
  List<Object?> get props => <Object?>[];
}
