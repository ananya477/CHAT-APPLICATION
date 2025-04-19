COMPANY : CODETECH IT SOLUTIONS

NAME : ANANYA GRACE JOSE

INTERN ID : CT04DA877

DOMAIN : FULL STACK WEB DEVELOPMENT

DURATION : 4 WEEKS

MENTOR : NEELA SANTHOSH



This project is a Real-Time Chat Application built using Node.js, Express.js, and Socket.IO for the backend, and vanilla JavaScript, HTML, and CSS for the frontend. It allows users to sign up, log in, create or join chat rooms,
and exchange messages in real time. Below is an overview of its features and architecture:

Key Features:

User Authentication:
Users can sign up with a username and password.
Passwords are securely hashed using bcrypt before being stored in the users.json file.
Users can log in with their credentials to access the chat application.

Chat Rooms:
Users can create new chat rooms or join existing ones.
Each room maintains a list of active users and a history of messages.
Users can leave a room and join another without losing their session.

Real-Time Messaging:
Messages are sent and received in real time using Socket.IO.
Messages are displayed in a chat interface with a distinction between sent and received messages.

Emoji Support:
Users can add emojis to their messages using an emoji picker.

Responsive Design:
The frontend is styled with modern CSS, ensuring a responsive and visually appealing user interface.

Persistent Data:
User data, room data, and message history are stored in JSON files (users.json, rooms.json, and messages.json) for persistence.
Project Structure:


Backend:

The backend is implemented in index.js using Express.js for API routes and Socket.IO for real-time communication.
Routes include:
/api/signup: Handles user registration.
/api/login: Handles user authentication.
/api/rooms: Fetches and creates chat rooms.
Socket.IO events handle room joining, leaving, and message broadcasting.

Frontend:

The frontend consists of index.html, style.css, and script.js.
It provides a user-friendly interface for authentication, room management, and chatting.

Data Storage:

User credentials and metadata are stored in users.json.
Room details and user lists are stored in rooms.json.
Message history is stored in messages.json.

How It Works:

A user signs up or logs in through the authentication interface.
After logging in, the user can view a list of available chat rooms or create a new one.
Upon joining a room, the user can send and receive messages in real time.
Messages and user activity are synchronized across all clients in the room.

Technologies Used:

Node.js: Backend runtime environment.
Express.js: Web framework for handling API routes.
Socket.IO: Real-time communication library.
bcrypt: For secure password hashing.
HTML/CSS/JavaScript: For the frontend.


![Screenshot 2025-04-19 211501](https://github.com/user-attachments/assets/45c325af-391a-436e-ba66-09f3b9d4b6f6)
![Screenshot 2025-04-19 211417](https://github.com/user-attachments/assets/95db7f17-e81c-4828-b95a-965662e9a349)
![Screenshot 2025-04-19 211354](https://github.com/user-attachments/assets/7160e9df-702f-4178-a250-88c64dbc760f)
![Screenshot 2025-04-19 211318](https://github.com/user-attachments/assets/289fb59a-1c10-494d-885e-0ab8fa5a356b)
![Screenshot 2025-04-19 211239](https://github.com/user-attachments/assets/ccb43af5-3d71-4560-a0d2-3f51256d07c4)
![Screenshot 2025-04-19 211208](https://github.com/user-attachments/assets/7c09623c-2ccd-4c81-aa04-06187ce292cb)
![Screenshot 2025-04-19 211145](https://github.com/user-attachments/assets/fa4374d9-2e70-4ab2-9c1a-ebbe2c4ffa12)
![Screenshot 2025-04-19 211023](https://github.com/user-attachments/assets/855d7b77-3f6f-4232-9b51-22d5a543efa7)
