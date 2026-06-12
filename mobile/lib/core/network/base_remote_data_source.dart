import 'package:dio/dio.dart';

import '../errors/exceptions.dart';

abstract class BaseRemoteDataSource {
  Future<T> safeApiCall<T>(Future<T> Function() apiCall);
}

class BaseRemoteDataSourceImpl implements BaseRemoteDataSource {
  @override
  Future<T> safeApiCall<T>(Future<T> Function() apiCall) async {
    try {
      final T response = await apiCall();

      if (response is Map<String, dynamic>) {
        if (response['status'] == false) {
          throw ServerException(
            response['message']?.toString() ?? 'Unknown server error',
          );
        }
      }

      return response;
    } on DioException catch (e) {
      throw ServerException(_extractErrorMessage(e.response?.data, e.message));
    } catch (e) {
      throw ServerException(e.toString());
    }
  }

  String _extractErrorMessage(dynamic data, String? fallback) {
    if (data is Map<String, dynamic>) {
      // handle FastAPI validation error
      if (data['detail'] is List && (data['detail'] as List).isNotEmpty) {
        return data['detail'][0]['msg']?.toString() ??
            fallback ??
            'Unknown error';
      }

      return data['message']?.toString() ?? fallback ?? 'Unknown error';
    }

    if (data is String) {
      return data;
    }

    return fallback ?? 'Unknown error';
  }

  List<T> mapList<T>(Object? data, T Function(Map<String, dynamic>) fromJson) {
    return (data! as List<dynamic>)
        .map((dynamic e) => fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
