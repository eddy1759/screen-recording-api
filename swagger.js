const config = require('./config/config');

const swagger = `
openapi: 3.0.0
info:
  title: Chrome Screen Recording ApiI
  description: API for streaming and managing video data.
servers:
  - url: ${config.BASE_URL}/
paths:
  /api/video/start:
    post:
      summary: Start video streaming.
      tags: 
        - Video Streaming
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                blob:
                  type: string
                  format: binary
                  description: The video data blob.
                videoId:
                  type: string
                  description: The video identifier.
      responses:
        '200':
          description: Video streaming in progress.
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: boolean
                    description: Indicates the status of the operation.
                  msg:
                    type: string
                    description: A message describing the result of the operation.

  /api/video/end/{id}:
    get:
      summary: Stop video streaming and process the video.
      tags:
        - Video Streaming
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The video identifier.
      responses:
        '200':
          description: Video streaming stopped and video processed successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: boolean
                    description: Indicates the status of the operation.
                  msg:
                    type: string
                    description: A message describing the result of the operation.

  /api/video/{id}:
    get:
      summary: Get video data by ID.
      tags:
        - Video Management
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The video identifier.
      responses:
        '200':
          description: Video data retrieved successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: boolean
                    description: Indicates the status of the operation.
                  msg:
                    type: string
                    description: A message describing the result of the operation.

  /api/video:
    get:
      tags:
        - Video Management
      summary: Get a list of all uploaded videos.
      responses:
        '200':
          description: List of videos retrieved successfully.
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    status:
                      type: boolean
                      description: Indicates the status of the operation.
                    id:
                      type: string
                      description: Unique ID of the video.
                    msg:
                      type: string
                      description: A message describing the result of the operation.

  /api/video/stream/{id}:
    get:
      summary: Stream uploaded video by ID.
      tags:
        - Video Streaming
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The video identifier.
      responses:
        '200':
          description: Video streaming in progress.
          content:
            video/mp4:
              schema:
                type: string
                format: binary
`;

module.exports = swagger;
