### Postgres-Prisma-NestJS-Chat-App

## Description

This is a FullStack TypeScript Real-time Chat application built using modern technologies such as NestJS, Prisma, GraphQL, Redis, Postgres, ReactJS, Apollo Client, Zustand, Mantine UI. The application provides a seamless real-time chatting experience with robust authentication and profile management features.

## Features

- Authentication Flow: Register, log in, and log out with JWT Tokens stored as HttpOnly cookies for secure access to protected mutations and queries.
- Profile Management: Update user name and profile avatar.
- Chatrooms: Create chatrooms and add members.
- Real-time Features: Implemented using GraphQL subscriptions over WebSockets to receive messages instantly and show typing indicators.
- Online User Tracking with Redis: Store and manage live users in a chatroom. Real-time updates of user lists as users join or leave.

## Technologies Used

**Backend:**  
NestJS  
Prisma  
GraphQL  
Redis  
Postgres  
Docker  
**Frontend:**  
ReactJS  
Apollo Client  
Zustand  
Mantine UI

## Getting Started

**Prerequisites:**  
Node.js  
Docker Desktop

## Installation

1. Clone the repository:

```bash
git clone https://github.com/bohdanadev/postgres-prisma-nestjs-chat-app.git
```

2. Set up environment variables:

Create a .env file in the **backend** directory and fill in the required environment variables based on the .env.example file.

Create a .env file in the **frontend** directory and fill in the required environment variables based on the .env.example file.

3. Start the application using Docker Compose:

```bash
$ cd backend
$ npm run start:docker:db
```

4. Start the server:

```bash
$ npm run start
```

5. Running the app

```bash
$ cd frontend
# watch mode
$ npm run dev
```

## Access the application:

Open your browser and navigate to http://localhost:5173 for the frontend and http://localhost:3000/graphql for the GraphQL Playground.
