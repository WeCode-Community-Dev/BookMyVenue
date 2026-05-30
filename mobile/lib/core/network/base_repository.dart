import 'package:fpdart/fpdart.dart';

import '../errors/exceptions.dart';
import '../errors/failures.dart';
import '../utils/type_def.dart';

abstract class BaseRepository {
  ResultFuture<T> handleRequest<T>(Future<T> Function() request) async {
    try {
      final T result = await request();
      return right(result);
    } on ServerException catch (e) {
      return left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return left(NetworkFailure(e.message));
    } catch (e) {
      return left(UnknownFailure(e.toString()));
    }
  }
}
