var currentServer = "";

class User {
    constructor(name, email, permissions, profilePicture) {
        this.name = name
        this.email = email
        this.servers = new Set()
        this.status = 3
        this.permissions = permissions
        this.profilePicture = profilePicture
    }

    servers() {
        return this.servers
    }
    email() {
        return this.email
    }
    name() {
        return this.name
    }
    perms() {
        return this.permissions
    }

    addServer(server) {
        if (this.servers.has(server)) return false
        this.servers.add(server)
        return true
    }

    removeServer(server) {
        if (this.servers.has(server)) return false
        this.servers.delete(server)
        return true
    }

    changePerms(perm) {
        this.permissions = perm
    }

    changePicture(picture) {
        this.picture = picture
    }
}

let currentUser = new User("GenericUsername", "example@gmail.com", "", "");

class Server {
    constructor(name, department, channels) {
        this.name = name
        this.department = department
        this.channels = new Set()
        for (let i = 0; i < channels.length; i++) {
            this.channels.add(channels[i])
        }
        this.users = new Set()

        this.createServerButton()
    }

    createServerButton() {
        let button = document.createElement("button");
        let temp = document.createTextNode(this.name);
        button.appendChild(temp);
        button.addEventListener("click", () => this.loadRooms());
        button.className = "serverButton";
        button.id = this.name;
        document.getElementById("classes").insertBefore(button, document.getElementById("editServerBtn"));
    }

    loadRooms() {
        let childChecker = document.getElementById("rooms");
        currentServer = this.name;

        while (childChecker.hasChildNodes()) {
            childChecker.removeChild(childChecker.children[0]);
        }

        // Edit button:
        let button = document.createElement("button");
        let temp = document.createTextNode("Edit");
        button.appendChild(temp);
        button.addEventListener("click", () => editChannels());
        button.className = "roomButton";
        button.id = "editChannelBtn";
        document.getElementById("rooms").appendChild(button);

        // The rest of the channels:
        for (let channel of this.channels) {
            let button = document.createElement("button");
            let temp = document.createTextNode(channel.name);
            button.appendChild(temp);
            button.addEventListener("click", () => this.colorChange(channel));
            button.setAttribute("Id", channel.name)
            button.className = "roomButton";
            button.id = channel.name;
            document.getElementById("rooms").appendChild(button);
        }
    }

    colorChange(channel) {
        for (let temp of this.channels) {
            document.getElementById(temp.name).style.color = "LightSlateGrey";
        }

        channel.loadChatroom()
    }

    name() {
        return this.name
    }
    channels() {
        return this.channels
    }
    department() {
        return this.department
    }
    users() {
        return this.users
    }

    setName(name) {
        this.name = name
    }
    addChannel(channel) {
        if (this.channels.has(channel)) return false
        this.channels.add(channel)
        this.loadRooms()
        return true
    }
    removeChannel(channel) {
        if (this.channels.has(channel)) return false
        this.channels.delete(channel)
        this.loadRooms()
        return true
    }
    addUser(user) {
        if (this.users.has(user)) return false
        this.users.add(user)
        return true
    }

    removeUser(user) {
        if (this.users.has(user)) return false
        this.users.delete(user)
        return true
    }
}

class Channel {
    constructor(name, category) {
        this.chatLogs = [] // maybe make this into set?
        this.category = category
        this.name = name
    }
    name() {
        return this.name
    }
    category() {
        return this.category
    }
    logs() {
        return this.chatLogs
    }

    loadChatroom() {
        document.getElementById("chatroomHeader").innerHTML = currentServer + "'s " + this.name + " Chatroom";
        document.getElementById(this.name).style.color = "rgb(6, 87, 238)";
    }
    // double check on how to link message with actual message in chatroom, right now its by text but could be by time/id
    message(message) {
        for (let i = 0; i < this.chatLogs.length; i++) {
            if (message == this.chatLogs[i].text) return this.chatLogs[i]
        }
    }
    addChat(message) {
        this.chatLogs.append(message)
    }

    removeChat(message) {
        let found = false;
        for (let i = 0; i < this.chatLogs.length; i++) {
            if (message == this.chatLogs[i].text) {
                this.chatLogs.splice(i, 1)
                found = true;
            }
        }
        return found;
    }

    editChat(message, newText) {
        this.Message(message).setText(newText)
    }

    setCategory(category) {
        this.category = category
    }
}

class ChatMessage {
    constructor(user, time, text) {
        this.user = user
        this.time = time
        this.text = text
    }

    user() {
        return this.user
    }
    time() {
        return this.time
    }
    text() {
        return this.text
    }

    setText(text) {
        this.text = text
    }

}

function goHome() {

}

let tempChannel = [
    new Channel("Homework Help", "help"),
    new Channel("Group chat", "Students"),
    new Channel("Exam Prep", "Exam")
]

let servers = [
    new Server("Calculus", "Math", tempChannel),
    new Server("Writing", "English", tempChannel),
    new Server("Chemistry", "Science", tempChannel),
    new Server("Spanish", "Language", tempChannel)
]

function sendMessage() {
    let chatborder = document.getElementById("chatborder");
    let chatbox = document.getElementById("chatbox");
    let textLine = document.getElementById("textLine");

    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + ", "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes();

    let newMessage = document.createElement("div");
    let userInfo = document.createElement("div");
    let messageText = document.createElement("div");

    userInfo.textContent = `[${datetime}] ${currentUser.name}:`;
    messageText.textContent = chatbox.value;

    newMessage.appendChild(userInfo);
    newMessage.appendChild(messageText);

    chatborder.insertBefore(newMessage, textLine);
    chatbox.value = "";
}

function createEditButton() {
    let button = document.createElement("button");
    let temp = document.createTextNode("Edit");
    button.appendChild(temp);
    button.addEventListener("click", () => editServers());
    button.className = "serverButton";
    button.id = "editServerBtn";
    document.getElementById("classes").appendChild(button);
}

createEditButton();

function editServers() {
    let action = prompt("Enter add or delete: ");

    if (action == "add") {
        let serverName = prompt("Enter server name to add: ");
        let departmentName = prompt("Enter department name: ");

        let newServer = new Server(serverName, departmentName, tempChannel);
    }

    else if (action == "delete") {
        serverName = prompt("Enter server name to delete: ");
        document.getElementById("classes").removeChild(document.getElementById(serverName));
    }
}

function editChannels() {
    let action = prompt("Enter add or delete: ");

    if (action == "add") {
        let channelName = prompt("Enter channel name to add: ");
        let channelCategory = prompt("Enter channel category: ");

        let newChannel = new Channel(channelName, channelCategory);
        servers[0].addChannel(newChannel); // get server by id, then call addChannel
    }

    else if (action == "delete") {
        channelName = prompt("Enter channel name to delete: ");
        document.getElementById("rooms").removeChild(document.getElementById(channelName));
    }
}
