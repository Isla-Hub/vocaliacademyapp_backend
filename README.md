# Vocali Academy Backend

The Vocali Academy Backend is a Node.js API built with Express.js, designed to provide backend functionalities for the Vocali Academy frontend application. It enables user authentication and offers CRUD operations for managing various entities such as users, rooms, services, events, payments, and bookings.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Prerequisites](#prerequisites)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [Known Issues](#known-issues)
- [License](#license)
- [Contact](#contact)

## Installation

To set up the Vocali Academy Backend locally, follow these steps:

1. Clone the repository from GitHub:

   ```bash
   git clone https://github.com/your-username/vocaliacademy-backend.git

2. Change into the project directory:

   ```bash
   cd vocaliacademy-backend

2. Install the required dependencies:

   ```bash
   npm install

## Usage

Once the installation is complete, you can run the backend service using the following command:

   ```bash
   npm run start
   ```

This will start the server, and the API will be accessible at **http://localhost:your-port**.

## Prerequisites

Before running the Vocali Academy Backend, you need to have the following installed:

- **Docker**: This is required to run a local container with the MongoDB database.

## Features

The Vocali Academy Backend provides the following main features:

- **User Authentication**: Allow users to register and log in securely.
- **CRUD Operations**: Enable Create, Read, Update, and Delete operations for academy entities including users, rooms, services, events, payments, and bookings.

## Environment Variables

To run the Vocaliacademy Backend successfully, you need to set the following environment variables in a `.env` file at the root of the project:

- `MONGO_URL`: The MongoDB connection URL.
- `JWT_SECRET`: Secret key used for JWT (JSON Web Tokens) encryption.

## Contributing

Contributions to the Vocali Academy Backend are welcome and encouraged! If you want to contribute to the project, please contact any of the developers in the [Contact](#contact) section down below.

## Known Issues

At the moment, there are no known issues with the Vocali Academy Backend. If you encounter any problems or have suggestions for improvement, feel free to open an issue on the GitHub repository.

## License

The Vocali Academy Backend is released under the [MIT](https://choosealicense.com/licenses/mit/) License

## Contact

If you have any questions, feedback, or need support, you can reach out to the project maintainers at:

- Users:
  - @cestela
  - @4cines
  - @Meira81

- GitHub Issues: vocaliacademy-backend/issues
