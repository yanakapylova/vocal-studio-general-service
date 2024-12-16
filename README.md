# Vocal Studio Server

This project is the central server for the Vocal Studio application. It manages communication between the app, the database, and RabbitMQ. You can run the server either with its internal Docker Compose file or as part of a unified setup with other project services.

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Docker
- Docker Compose

### Running the Server

1. Clone the repository:
   ```bash
   git clone https://github.com/yanakapylova/vocal-studio-general-service
   cd https://github.com/yanakapylova/vocal-studio-general-service
   ```

3. Start the server using the internal Docker Compose file:
   ```bash
   docker-compose up --build
   ```
4. The server will start on port `3008`.

## Configuration

- **Port**: The application runs on port `3008` by default.
The following services and databases will be started as part of the unified Docker Compose setup:

- **Server**: The core backend service of Vocal Studio, running on port `3008`.
  - Connects to the PostgreSQL database and RabbitMQ message broker.
  - Uses Redis for caching.

- **PostgreSQL**: A relational database, running on port `5432`.

- **Redis**: An in-memory data store for caching, running on port `6379`.

- **RabbitMQ**: A message broker, running on the following ports:
  - `5672`: AMQP port for communication between services.
  - `15672`: Management UI port.

All services are connected via the `vocal-studio` Docker network to ensure seamless communication.

## Troubleshooting

- **Port Conflicts**: If port `3008` is already in use, update the port in the Docker Compose file.
- **RabbitMQ Issues**: Verify that RabbitMQ is running and accessible on `localhost:5672`.
- **Database Connectivity**: Ensure the database URL is correct and reachable from the server.

## Contact
For questions or issues, please contact the application developer or the team responsible for this project.
