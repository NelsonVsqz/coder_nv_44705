const socket = io();

const emailForm = document.getElementById('email-form');
const messageForm = document.getElementById('message-form');
const input = document.getElementById('message-input');
const hiddenEmailInput = document.getElementById('hidden-email-input');
const messages = document.getElementById('messages');

emailForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email-input').value;
  hiddenEmailInput.value = email; 
  emailForm.style.display = 'none'; 
  messageForm.style.display = 'block'; 
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = hiddenEmailInput.value; 
  const message = input.value;
  input.value = '';

  const data = { email, message };
  socket.emit('chat message', data);
});

socket.on('chat message', (message) => {
  const li = document.createElement('li');
  li.textContent = `${message.user}: ${message.message}`;
  messages.appendChild(li);
});


window.addEventListener('DOMContentLoaded', () => {
  fetch('/messages')
    .then((response) => response.json())
    .then((data) => {
      data.forEach((message) => {
        const li = document.createElement('li');
        li.textContent = `${message.user}: ${message.message}`;
        messages.appendChild(li);
      });
    });
});