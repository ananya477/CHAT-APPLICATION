const socket = io('http://localhost:4001');

let currentRoom = "";
let currentUsername = ""; // Add this to track current user

// Add more emojis
const emojis = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', 
    '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐',
    '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '✨', '🎵', '🎶',
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙',
    '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️'
];

// Add the scrollToBottom helper function
function scrollToBottom() {
  const messagesBox = document.getElementById('messages');
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

// Auth Functions
async function signup() {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            alert('Signup successful! Please login.');
            toggleAuth('login');
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Error during signup');
    }
}

async function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            currentUsername = username;
            document.getElementById('userDisplayName').textContent = username;
            showRoomList();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Error during login');
    }
}

function logout() {
    currentUsername = "";
    currentRoom = "";
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('roomListContainer').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'none';
}

// Room Functions
async function loadRooms() {
    try {
        const response = await fetch('/api/rooms');
        const rooms = await response.json();
        
        const roomList = document.getElementById('roomList');
        roomList.innerHTML = '';
        
        rooms.forEach(room => {
            const roomCard = document.createElement('div');
            roomCard.className = 'room-card';
            roomCard.innerHTML = `
                <h3>${room.name}</h3>
                <p>${room.userCount} users online</p>
            `;
            roomCard.onclick = () => joinRoom(room.name);
            roomList.appendChild(roomCard);
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
    }
}

async function createRoom() {
    const roomName = document.getElementById('newRoomInput').value.trim();
    if (!roomName) return;

    try {
        const response = await fetch('/api/rooms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: roomName })
        });

        const data = await response.json();
        if (data.success) {
            document.getElementById('newRoomInput').value = '';
            loadRooms();
        } else {
            alert(data.error);
        }
    } catch (error) {
        alert('Error creating room');
    }
}

function joinRoom(roomName) {
    currentRoom = roomName;
    socket.emit('joinRoom', { room: roomName, username: currentUsername });
    
    document.getElementById('roomListContainer').style.display = 'none';
    document.getElementById('chatContainer').style.display = 'flex';
    document.getElementById('currentRoom').textContent = roomName;
    document.getElementById('messages').innerHTML = '';
}

function leaveRoom() {
    socket.emit('leaveRoom', { room: currentRoom });
    currentRoom = "";
    document.getElementById('chatContainer').style.display = 'none';
    document.getElementById('roomListContainer').style.display = 'block';
    loadRooms();
}

// UI Functions
function toggleAuth(type) {
    document.getElementById('loginForm').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('signupForm').style.display = type === 'signup' ? 'block' : 'none';
}

function showRoomList() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('roomListContainer').style.display = 'block';
    loadRooms();
}

socket.on('message', ({ user, message }) => {
  const div = document.createElement('div');
  div.innerHTML = `<strong>${user}:</strong> ${message}`;
  
  // Add appropriate class based on who sent the message
  if (user === currentUsername) {
    div.className = 'sent-message';
  } else {
    div.className = 'received-message';
  }
  
  document.getElementById('messages').appendChild(div);
  scrollToBottom();
});

function sendMessage() {
  const msg = document.getElementById('messageInput').value;
  if (msg.trim()) {
    socket.emit('chatMessage', { room: currentRoom, message: msg });
    document.getElementById('messageInput').value = '';
    scrollToBottom();
  }
}

function openEmojiPicker() {
  const picker = document.getElementById('emojiPicker');
  picker.innerHTML = '';
  
  // Create emoji grid container
  const gridContainer = document.createElement('div');
  gridContainer.style.display = 'grid';
  gridContainer.style.gridTemplateColumns = 'repeat(8, 1fr)'; // 8 emojis per row
  gridContainer.style.gap = '5px';
  
  emojis.forEach(e => {
    const btn = document.createElement('button');
    btn.textContent = e;
    btn.style.fontSize = '20px';
    btn.style.padding = '5px';
    btn.style.cursor = 'pointer';
    btn.onclick = () => {
      const messageInput = document.getElementById('messageInput');
      messageInput.value += e;
      messageInput.focus();
      picker.style.display = 'none';
    };
    gridContainer.appendChild(btn);
  });
  
  picker.appendChild(gridContainer);
  picker.style.display = 'block';
}

// Close emoji picker when clicking outside
document.addEventListener('click', (e) => {
  const picker = document.getElementById('emojiPicker');
  const emojiButton = document.querySelector('.input-section button');
  if (!picker.contains(e.target) && e.target !== emojiButton) {
    picker.style.display = 'none';
  }
});

socket.on('roomUsers', ({ users }) => {
  const list = document.getElementById('userList');
  list.innerHTML = '';
  users.forEach(u => {
    const li = document.createElement('li');
    li.textContent = u;
    list.appendChild(li);
  });
});

// Add event listener for Enter key in message input
document.getElementById('messageInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Show login form by default
    toggleAuth('login');
});


