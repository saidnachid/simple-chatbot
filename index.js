const toggler = document.querySelector(".toggler");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatMessagesContainer = document.querySelector(".chat-content");
const closeBtn = document.getElementById("close-btn");
const body = document.body;

const brain = JSON.parse(localStorage.getItem("chatBrain")) || {};

let isLearning = false;
let lastUserQuestion = "";

toggler.addEventListener("click", () => body.classList.toggle("show"));
closeBtn.addEventListener("click", () => body.classList.remove("show"));

function appendMessage(content, type = "outgoing") {
  const messageDiv = document.createElement("div");
  messageDiv.className = `chat ${type}`;
  messageDiv.textContent = content;
  chatMessagesContainer.appendChild(messageDiv);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  return messageDiv;
}

function saveBrain() {
  localStorage.setItem("chatBrain", JSON.stringify(brain));
}

function learnAnswer(question, answer) {
  brain[question] = answer;
  isLearning = false;
  lastUserQuestion = "";
  saveBrain();
  return "Got it! I'll remember that.";
}

function findAnswer(question) {
  if (isLearning) {
    return learnAnswer(lastUserQuestion, question);
  }

  if (brain.hasOwnProperty(question)) {
    return brain[question];
  } else {
    isLearning = true;
    lastUserQuestion = question;
    return "I don't know the answer. What should I say?";
  }
}

async function startChat(message) {
  appendMessage(message, "outgoing");
  const thinkingMessageElement = appendMessage("thinking...", "incoming");
  const reply = findAnswer(message); // This is still synchronous
  setTimeout(() => {
    thinkingMessageElement.textContent = reply;
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }, 1000);
}

function handleInput() {
  const message = chatInput.value.trim();
  if (!message) return;
  startChat(message);
  chatInput.value = "";
}

chatInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    handleInput();
  }
});

sendBtn.addEventListener("click", handleInput);
