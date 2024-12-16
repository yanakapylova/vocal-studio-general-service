# Vocal Studio Server

This project is the central server for the Vocal Studio application. It manages communication between the app, the database, and RabbitMQ. You can run the server either with its internal Docker Compose file or as part of a unified setup with other project services.

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Docker
- Docker Compose

### Running the Server

#### Option 1: Using the Unified Docker Compose File (preferable)

1. Request the unified Docker Compose file from the application developer.

2. Use the unified Docker Compose file to run all services, including the server, databases, and RabbitMQ:
   ```bash
   docker-compose up --build
   ```

3. The server will start on port `3008` as part of the complete setup.

#### Option 2: Using the Internal Docker Compose File

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Set up RabbitMQ separately by running the following command:
   ```bash
   docker run -d \
      --name rabbitmq \
      -p 5672:5672 \
      -p 15672:15672 \
      -e RABBITMQ_DEFAULT_USER=guest \
      -e RABBITMQ_DEFAULT_PASS=guest \
      rabbitmq:management
   ```

3. Start the server using the internal Docker Compose file:
   ```bash
   docker-compose up --build
   ```

4. The server will start on port `3008`.

## Configuration

- **Port**: The application runs on port `3008` by default.
- **RabbitMQ**: Ensure RabbitMQ is set up using the command above or through the unified Docker Compose file.
- **Database**: The server connects to a remote database specified in the internal Docker Compose file or the unified configuration.

## Troubleshooting

- **Port Conflicts**: If port `3008` is already in use, update the port in the Docker Compose file.
- **RabbitMQ Issues**: Verify that RabbitMQ is running and accessible on `localhost:5672`.
- **Database Connectivity**: Ensure the database URL is correct and reachable from the server.

## Contact
For questions or issues, please contact the application developer or the team responsible for this project.