# API Documentation

- Base URL: https://hng5.onrender.com

### Authentication
-No authentication required for the provided endpoints.

### Upload Video

    - Request:
        Endpoint: https://hng5.onrender.com/api/recording
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
                "msg": "Video Uploaded Successful"
            }


### Stream Video

    - Request:
        Endpoint: https://hng5.onrender.com/api/recording/<id>
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
