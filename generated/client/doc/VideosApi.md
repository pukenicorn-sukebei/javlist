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
> BuiltList<VideoDto> videosControllerGetVideos(codes, tags, makers, labels)



### Example
```dart
import 'package:javlist_client/api.dart';

final api = JavlistClient().getVideosApi();
final BuiltList<String> codes = ; // BuiltList<String> | 
final BuiltList<String> tags = ; // BuiltList<String> | 
final BuiltList<String> makers = ; // BuiltList<String> | 
final BuiltList<String> labels = ; // BuiltList<String> | 

try {
    final response = api.videosControllerGetVideos(codes, tags, makers, labels);
    print(response);
} catch on DioError (e) {
    print('Exception when calling VideosApi->videosControllerGetVideos: $e\n');
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **codes** | [**BuiltList&lt;String&gt;**](String.md)|  | 
 **tags** | [**BuiltList&lt;String&gt;**](String.md)|  | 
 **makers** | [**BuiltList&lt;String&gt;**](String.md)|  | 
 **labels** | [**BuiltList&lt;String&gt;**](String.md)|  | 

### Return type

[**BuiltList&lt;VideoDto&gt;**](VideoDto.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

