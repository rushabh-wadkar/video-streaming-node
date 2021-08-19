const VIDEO_DIRECTORY = "videos";
const VIDEO_STREAM_CHUNK_SIZE = 10 ** 6; //1MB

// video mime types
const VIDEO_MIME_TYPES_MAPPING = {
  "3gp": "video/3gpp",
  mp4: "video/mp4",
  m4a: "video/mp4",
  m4p: "video/mp4",
  m4b: "video/mp4",
  m4r: "video/mp4",
  m1v: "video/mpeg",
  ogg: "video/ogg",
  webm: "video/webm",
  wmv: "video/x-ms-wmv",
  wmv: "video/x-msvideo",
  mov: "video/quicktime",
};

module.exports = {
  VIDEO_DIRECTORY,
  VIDEO_STREAM_CHUNK_SIZE,
  VIDEO_MIME_TYPES_MAPPING,
};
