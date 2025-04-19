const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = 4001;
const messagesFilePath = path.join(__dirname, 'messages.json');
const usersFilePath = path.join(__dirname, 'users.json');
const roomsFilePath = path.join(__dirname, 'rooms.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Initialize JSON files if they don't exist
function initializeJSONFile(filePath, defaultContent = {}) {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
        }
    } catch (err) {
        console.error(`Error initializing ${filePath}:`, err);
    }
}

// Initialize all required JSON files
initializeJSONFile(usersFilePath, {});
initializeJSONFile(roomsFilePath, {});
initializeJSONFile(messagesFilePath, []);

// Load data
let users = {};
let rooms = {};

try {
    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    const roomsData = fs.readFileSync(roomsFilePath, 'utf8');
    users = JSON.parse(usersData || '{}');
    rooms = JSON.parse(roomsData || '{}');
} catch (err) {
    console.error('Error loading data:', err);
}

// Auth Routes
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (users[username]) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users[username] = {
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        console.log('User registered:', username);
        res.json({ success: true });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error during signup' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!users[username]) {
            return res.status(400).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, users[username].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error during login' });
    }
});

// Room Routes
app.get('/api/rooms', (req, res) => {
    try {
        const roomList = Object.keys(rooms).map(room => ({
            name: room,
            userCount: rooms[room]?.users?.length || 0
        }));
        res.json(roomList);
    } catch (error) {
        console.error('Error getting rooms:', error);
        res.status(500).json({ error: 'Internal server error getting rooms' });
    }
});

app.post('/api/rooms', (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: 'Room name is required' });
        }

        if (rooms[name]) {
            return res.status(400).json({ error: 'Room already exists' });
        }

        rooms[name] = { users: [], messages: [] };
        fs.writeFileSync(roomsFilePath, JSON.stringify(rooms, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ error: 'Internal server error creating room' });
    }
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('🔌 New client connected');

    socket.on('joinRoom', ({ room, username }) => {
        socket.join(room);

        if (!rooms[room]) rooms[room] = { users: [], messages: [] };
        rooms[room].users.push({ id: socket.id, name: username });

        socket.data.room = room;
        socket.data.username = username;

        io.to(room).emit('roomUsers', {
            users: rooms[room].users.map(u => u.name)
        });

        // Send past messages
        const messages = rooms[room].messages || [];
        messages.forEach(msg => {
            socket.emit('message', msg);
        });
    });

    socket.on('chatMessage', ({ room, message }) => {
        const user = socket.data.username || 'Anonymous';
        const messageData = { user, message };

        if (rooms[room]) {
            rooms[room].messages.push(messageData);
            io.to(room).emit('message', messageData);
        }
    });

    socket.on('disconnect', () => {
        const room = socket.data.room;
        if (room && rooms[room]) {
            rooms[room].users = rooms[room].users.filter(u => u.id !== socket.id);

            io.to(room).emit('roomUsers', {
                users: rooms[room].users.map(u => u.name)
            });
        }
        console.log('❌ Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
