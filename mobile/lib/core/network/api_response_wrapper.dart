import '../model/api_response.dart';

class ApiResponseMapper {
  static ApiResponse<T> fromJson<T>(
    Map<String, dynamic> json,
    T Function(Object? data) fromJsonT,
  ) {
    return ApiResponse<T>.fromJson(json, (Object? data) {
      return fromJsonT(data);
    });
  }
}
