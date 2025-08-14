const socket = io();

let username = '';

function askUsername() {
  username = prompt('Enter your username:');
  if (!username || username.trim() === '') {
    alert('Username cannot be empty');
    askUsername();
  } else {
    socket.emit('new user', username);
  }
}

askUsername();

const userList = document.getElementById('user-list');
const chatArea = document.getElementById('chat-area');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const msg = messageInput.value.trim();
  if (msg === '') return;

  socket.emit('chat message', {
    username,
    message: msg
  });

  messageInput.value = '';
}

function addMessage(sender, message, isSelf) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message-bubble');
  messageDiv.classList.add(isSelf ? 'self' : 'other');
  messageDiv.innerHTML = `<strong>${sender}</strong>${message}`;
  chatArea.appendChild(messageDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

socket.on('chat message', (data) => {
  addMessage(data.username, data.message, data.username === username);
});

socket.on('user list', (users) => {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user;
    userList.appendChild(li);
  });
});
