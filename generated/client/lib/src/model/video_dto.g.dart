// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'video_dto.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$VideoDto extends VideoDto {
  @override
  final String id;
  @override
  final String code;
  @override
  final String? name;
  @override
  final DateTime? releaseDate;
  @override
  final num? length;
  @override
  final String? coverUrl;
  @override
  final BuiltList<String> sampleUrls;
  @override
  final String? maker;
  @override
  final String? label;
  @override
  final BuiltList<String> tags;
  @override
  final BuiltList<String> directors;
  @override
  final BuiltList<String> actors;

  factory _$VideoDto([void Function(VideoDtoBuilder)? updates]) =>
      (new VideoDtoBuilder()..update(updates))._build();

  _$VideoDto._(
      {required this.id,
      required this.code,
      this.name,
      this.releaseDate,
      this.length,
      this.coverUrl,
      required this.sampleUrls,
      this.maker,
      this.label,
      required this.tags,
      required this.directors,
      required this.actors})
      : super._() {
    BuiltValueNullFieldError.checkNotNull(id, r'VideoDto', 'id');
    BuiltValueNullFieldError.checkNotNull(code, r'VideoDto', 'code');
    BuiltValueNullFieldError.checkNotNull(
        sampleUrls, r'VideoDto', 'sampleUrls');
    BuiltValueNullFieldError.checkNotNull(tags, r'VideoDto', 'tags');
    BuiltValueNullFieldError.checkNotNull(directors, r'VideoDto', 'directors');
    BuiltValueNullFieldError.checkNotNull(actors, r'VideoDto', 'actors');
  }

  @override
  VideoDto rebuild(void Function(VideoDtoBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  VideoDtoBuilder toBuilder() => new VideoDtoBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is VideoDto &&
        id == other.id &&
        code == other.code &&
        name == other.name &&
        releaseDate == other.releaseDate &&
        length == other.length &&
        coverUrl == other.coverUrl &&
        sampleUrls == other.sampleUrls &&
        maker == other.maker &&
        label == other.label &&
        tags == other.tags &&
        directors == other.directors &&
        actors == other.actors;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, id.hashCode);
    _$hash = $jc(_$hash, code.hashCode);
    _$hash = $jc(_$hash, name.hashCode);
    _$hash = $jc(_$hash, releaseDate.hashCode);
    _$hash = $jc(_$hash, length.hashCode);
    _$hash = $jc(_$hash, coverUrl.hashCode);
    _$hash = $jc(_$hash, sampleUrls.hashCode);
    _$hash = $jc(_$hash, maker.hashCode);
    _$hash = $jc(_$hash, label.hashCode);
    _$hash = $jc(_$hash, tags.hashCode);
    _$hash = $jc(_$hash, directors.hashCode);
    _$hash = $jc(_$hash, actors.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'VideoDto')
          ..add('id', id)
          ..add('code', code)
          ..add('name', name)
          ..add('releaseDate', releaseDate)
          ..add('length', length)
          ..add('coverUrl', coverUrl)
          ..add('sampleUrls', sampleUrls)
          ..add('maker', maker)
          ..add('label', label)
          ..add('tags', tags)
          ..add('directors', directors)
          ..add('actors', actors))
        .toString();
  }
}

class VideoDtoBuilder implements Builder<VideoDto, VideoDtoBuilder> {
  _$VideoDto? _$v;

  String? _id;
  String? get id => _$this._id;
  set id(String? id) => _$this._id = id;

  String? _code;
  String? get code => _$this._code;
  set code(String? code) => _$this._code = code;

  String? _name;
  String? get name => _$this._name;
  set name(String? name) => _$this._name = name;

  DateTime? _releaseDate;
  DateTime? get releaseDate => _$this._releaseDate;
  set releaseDate(DateTime? releaseDate) => _$this._releaseDate = releaseDate;

  num? _length;
  num? get length => _$this._length;
  set length(num? length) => _$this._length = length;

  String? _coverUrl;
  String? get coverUrl => _$this._coverUrl;
  set coverUrl(String? coverUrl) => _$this._coverUrl = coverUrl;

  ListBuilder<String>? _sampleUrls;
  ListBuilder<String> get sampleUrls =>
      _$this._sampleUrls ??= new ListBuilder<String>();
  set sampleUrls(ListBuilder<String>? sampleUrls) =>
      _$this._sampleUrls = sampleUrls;

  String? _maker;
  String? get maker => _$this._maker;
  set maker(String? maker) => _$this._maker = maker;

  String? _label;
  String? get label => _$this._label;
  set label(String? label) => _$this._label = label;

  ListBuilder<String>? _tags;
  ListBuilder<String> get tags => _$this._tags ??= new ListBuilder<String>();
  set tags(ListBuilder<String>? tags) => _$this._tags = tags;

  ListBuilder<String>? _directors;
  ListBuilder<String> get directors =>
      _$this._directors ??= new ListBuilder<String>();
  set directors(ListBuilder<String>? directors) =>
      _$this._directors = directors;

  ListBuilder<String>? _actors;
  ListBuilder<String> get actors =>
      _$this._actors ??= new ListBuilder<String>();
  set actors(ListBuilder<String>? actors) => _$this._actors = actors;

  VideoDtoBuilder() {
    VideoDto._defaults(this);
  }

  VideoDtoBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _id = $v.id;
      _code = $v.code;
      _name = $v.name;
      _releaseDate = $v.releaseDate;
      _length = $v.length;
      _coverUrl = $v.coverUrl;
      _sampleUrls = $v.sampleUrls.toBuilder();
      _maker = $v.maker;
      _label = $v.label;
      _tags = $v.tags.toBuilder();
      _directors = $v.directors.toBuilder();
      _actors = $v.actors.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(VideoDto other) {
    ArgumentError.checkNotNull(other, 'other');
    _$v = other as _$VideoDto;
  }

  @override
  void update(void Function(VideoDtoBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  VideoDto build() => _build();

  _$VideoDto _build() {
    _$VideoDto _$result;
    try {
      _$result = _$v ??
          new _$VideoDto._(
              id: BuiltValueNullFieldError.checkNotNull(id, r'VideoDto', 'id'),
              code: BuiltValueNullFieldError.checkNotNull(
                  code, r'VideoDto', 'code'),
              name: name,
              releaseDate: releaseDate,
              length: length,
              coverUrl: coverUrl,
              sampleUrls: sampleUrls.build(),
              maker: maker,
              label: label,
              tags: tags.build(),
              directors: directors.build(),
              actors: actors.build());
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'sampleUrls';
        sampleUrls.build();

        _$failedField = 'tags';
        tags.build();
        _$failedField = 'directors';
        directors.build();
        _$failedField = 'actors';
        actors.build();
      } catch (e) {
        throw new BuiltValueNestedFieldError(
            r'VideoDto', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
