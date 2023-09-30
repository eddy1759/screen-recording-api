# API Documentation

- Base URL: https://hng5.onrender.com

### Authentication
-No authentication required for the provided endpoints.

### Upload Video

    - Request:
        Endpoint: /api/recording
        Method: POST
        Headers: None
        Body:
          - chunk: video

    - Response:
        Status: 201 Created
        Body:
            {
                "status": true,
                "id": "video123",
                "msg": "Video Uploaded Successful"
            }


### Stream Video

    - Request:
        Endpoint: /api/recording/:videoFilename
        Method: GET
        Headers: None

    - Response:
        Status: 200 OK
        Headers:
        Content-Type: video/mp4
        Content-Disposition: inline; filename="video123.webm"
        Body: The binary video content.
