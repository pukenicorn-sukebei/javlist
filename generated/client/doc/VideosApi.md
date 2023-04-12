# javlist_client.api.VideosApi

## Load the API package
```dart
import 'package:javlist_client/api.dart';
```

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**videosControllerGetVideo**](VideosApi.md#videoscontrollergetvideo) | **GET** /videos/{code} | 
[**videosControllerGetVideos**](VideosApi.md#videoscontrollergetvideos) | **GET** /videos | 


# **videosControllerGetVideo**
> VideoDto videosControllerGetVideo(code, force)



### Example
```dart
import 'package:javlist_client/api.dart';

final api = JavlistClient().getVideosApi();
final String code = code_example; // String | 
final bool force = true; // bool | 

try {
    final response = api.videosControllerGetVideo(code, force);
    print(response);
} catch on DioError (e) {
    print('Exception when calling VideosApi->videosControllerGetVideo: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **code** | **String**|  | 
 **force** | **bool**|  | 

### Return type

[**VideoDto**](VideoDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **videosControllerGetVideos**
> BuiltList<VideoDto> videosControllerGetVideos()



### Example
```dart
import 'package:javlist_client/api.dart';

final api = JavlistClient().getVideosApi();

try {
    final response = api.videosControllerGetVideos();
    print(response);
} catch on DioError (e) {
    print('Exception when calling VideosApi->videosControllerGetVideos: $e\n');
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**BuiltList&lt;VideoDto&gt;**](VideoDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

