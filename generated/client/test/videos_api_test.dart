import 'package:test/test.dart';
import 'package:javlist_client/javlist_client.dart';


/// tests for VideosApi
void main() {
  final instance = JavlistClient().getVideosApi();

  group(VideosApi, () {
    //Future<VideoDto> videosControllerGetVideo(String code, bool force) async
    test('test videosControllerGetVideo', () async {
      // TODO
    });

    //Future<BuiltList<VideoDto>> videosControllerGetVideos() async
    test('test videosControllerGetVideos', () async {
      // TODO
    });

  });
}
