const socket = io.connect("http://localhost:3000"); // Adjust the URL to match your server
const clientsTotal = document.getElementById("clients-total");
const messageContainer = document.getElementById("chat-container");
const senderName = document.getElementById("name-input");
const messageInput = document.getElementById("message");
const messageForm = document.getElementById("message-form");
const alertBox = document.getElementById("alertBox");
const feedback = document.getElementById("feedback");

// Event listners
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

messageInput.addEventListener("focus", (e) => {
  socket.emit("typing", {
    feedback: `✍️ ${senderName.value} is typing a message`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("typing", {
    feedback: `✍️ ${senderName.value} is typing a message`,
  });
});
messageInput.addEventListener("blur", (e) => {
  socket.emit("typing", {
    feedback: "",
  });
});

//------------------------|

// Socket connections
socket.on("connect", () => {
  console.log("Connected with socket id:", socket.id);
});

socket.on("total-clients", (data) => {
  clientsTotal.innerText = `Total clients ${data}`;
});

socket.on("messageReceived", (data) => {
  console.log(data);

  const element = `<li class="left-chat">
  <p class="message">
      ${data.message} 
      <span>  ${data.dateTime} </span>
  </p>
</li>`;

  messageContainer.innerHTML += element;
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
});

socket.on("feedback", (data) => {
  const element = `
          <li class="message-feedback">
            <p class="feedback" id="feedback">${data.feedback}</p>
          </li>
    `;
  messageContainer.innerHTML += element;
});

// -------------------------------------------------------------|

// Functions

const sendMessage = () => {
  const data = {
    message: messageInput.value,
    name: senderName.value,
    dateTime: formatDate(new Date()),
  };

  if (data.message) {
    socket.emit("messageSent", data);
    addMessage(true, data);
    messageInput.value = "";
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
  } else {
    alertBox.style.display = "flex";
    setTimeout(() => {
      alertBox.style.display = "none";
    }, 2000);
  }
};

const addMessage = (OwnMessage, data) => {
  const element = `<li class="${OwnMessage ? "right-chat" : "left-chat"}">
  <p class="message">
      ${data.message}
      <span> ${data.dateTime}</span>
  </p>
</li>`;

  messageContainer.innerHTML += element;
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds} | ${day}-${month}-${year}`;
};
