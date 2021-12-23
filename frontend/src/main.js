import "98.css";
import "./style.scss";
import { io } from "socket.io-client";
import striptags from "striptags";
import twemoji from "twemoji";
import { marked } from "marked";

const chat = document.querySelector("#chat-box");
const chatInput = document.querySelector("#chat-input");
const chatUser = document.querySelector("#chat-user");
var user = localStorage.getItem("user");

function usernameThing() {
    if (localStorage.getItem("user") != user) {
        localStorage.setItem("user", user);
    }
    chatUser.textContent = user;
}
while (user == null || user == "") {
    user = striptags(prompt("Enter a username"));
}
usernameThing();

const sck = io("ws://" + window.location.hostname + ":4025", {transports: ["websocket", "polling"]});
sck.emit("user join", user);
// ok lets find a way to run all things on the same port // css is fucked
sck.emit("chat message", {
    system: true,
    content: `<p>User <span class="user">${user}</span> joined! :D</p>`,
});

chatUser.onclick = () => {
    var newUser = null;
    while (newUser == null || newUser == "") {
        // css
        newUser = striptags(prompt("Enter a new username"));
    }
    user = newUser;
    usernameThing();
};

function addMessage(author, content, system = false) {
    const date = new Date();
    const div = document.createElement("div");
    div.classList.add("msg");
    if (system) {
        author = "System";
        div.classList.add("sys");
    }
    div.innerHTML = `<div class="info">
      <span>${date.getHours()}:${date.getMinutes()}</span>
      <span class="author">${author}</span>
      <span class="sep">:</span>
  </div>
  <div class="content box">
      ${marked.parse(content)}
  </div>`;
    div.querySelector(".content")
        .querySelectorAll("a")
        .forEach((a) => {
            a.target = "_blank";
        });
    chat.appendChild(div);
}

sck.on("chat message", function (data) {
    addMessage(data.user, data.content, data.system);
});
chatInput.addEventListener("keyup", (e) => {
    if (!e.shiftKey && e.key == "Enter") {
        const content = chatInput.value;
        if (content.trim().length > 0)
            sck.emit("chat message", {
                user: user,
                content: striptags(twemoji.parse(content), "<img>"),
            });
        chatInput.value = "";
    }
});

// socket.on("receiveImage", function (data) {
//     // document.getElementById("showImage").src = data.path;
//     var img = '<img id="showImage" src="' + data.path + '" width="100"/>';

//     $("#show-message").append(img);
// });
