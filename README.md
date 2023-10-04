# API Documentation

- Base URL: https://hng5.onrender.com

- API DOC: https://hng5.onrender.com/api/doc/

### Authentication
-No authentication required for the provided endpoints.

### Stream Video Chunk

    - Request: This Request start the video streaming in chunk and merge the chunk when streaming has ended
        Endpoint: https://hng5.onrender.com/api/video/start
        Method: POST
        Headers: None
        Body:
          - chunk: video
          - {
                <Video Chunks>
            }

    - Response:
        Status: 201 Created
        Body:
            {
                "status": true,
                "id": "unique_video_id",
                "msg": "Video streamed Successful"
            }


### Stream Video

    - Request: This request process the chunk video data when the streaming has ended
        Endpoint: https://hng5.onrender.com/api/video/<id>
        Method: GET
        Headers: None
        Usage:
          - Send a GET request with the video id as a parameter.
          - It serves the requested video file, supports video range requests.

    - Response:
        Status: 200 OK
        Headers:
            Status Code: 200 OK (If the video exists)
            Status Code: 206 Partial Content (If video streaming with range)
            Status Code: 404 Not Found (If the video does not exist)

            Content-Range (if streaming): Indicates the range of bytes being sent.
            Content-Length: The length of the video file.
            Content-Type: The content type (video/mp4).

        Body: The binary video content.

        Note: Video streaming is supported with the use of the Range header.
