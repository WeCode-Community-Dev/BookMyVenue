import 'package:dio/dio.dart';

import '../errors/exceptions.dart';

abstract class BaseRemoteDataSource {
  Future<T> safeApiCall<T>(Future<T> Function() apiCall);
}

class BaseRemoteDataSourceImpl implements BaseRemoteDataSource {
  @override
  Future<T> safeApiCall<T>(Future<T> Function() apiCall) async {
    try {
      return await apiCall();
    } on DioException catch (e) {
      throw AppException.fromDio(e);
    } catch (e) {
      throw ServerException(e.toString());
    }
  }
}
