import '../model/api_response.dart';

// class ApiResponseMapper {
//   static ApiResponse<T> fromJson<T>(
//     Map<String, dynamic> json,
//     T Function(Map<String, dynamic>) fromJson,
//   ) {
//     AppLogger.debug('result remote mapper ${json}');
//     return ApiResponse<T>.fromJson(json, (Object? data) {
//       AppLogger.debug('result remote mapper ${data}');
//       return fromJson(data! as Map<String, dynamic>);
//     });
//   }
// }

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
