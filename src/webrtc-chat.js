const { io } = require("socket.io-client");
const  {
	createRTCConnectionManager,
	RTCConnectionHandler,
	RTCConnectionManager,
} = require("rtc-socket-connector-client");

function main() {
	// Get HTML elements
	const connectedSocketId = document.getElementById("connectedSocketId");
	const connectBtn = document.getElementById("connectBtn") ;
	const messageInput = document.getElementById("messageInput") ;
	const sendBtn = document.getElementById("sendBtn") ;
	const messageList = document.getElementById("messageList") ;
	const targetInput = document.getElementById("targetInput") 


	// 1. Connect to socket.io server
	const socket = io("http://localhost:5000");
	socket.on("connect", handleSocketConnect);

	let dataChannel=  RTCDataChannel | null;

	// 2. Define RTCConnectionHandler
	const handler = {
		onDataChannel: handleOnDataChannel,
	};

	// 3. Create RTCConnectionManager
	const rtcConnectionManager = createRTCConnectionManager(socket, handler);

	// Add button handlers
	connectBtn.addEventListener("click", () => {
		// 4. Connect to another client
		rtcConnectionManager.connect(targetInput.value, {
			enableDataChannel: true,
		});
	});
	sendBtn.addEventListener("click", handleClickSendMessageBtn);


	// Functions
	function addMessage(message) {
		const elem = document.createElement("p");
		elem.innerHTML = message;
		messageList.appendChild(elem);
	}


	// Handlers
	function handleOnDataChannel(
		socketId,
		newDataChannel
	) {
		connectedSocketId.textContent = socketId;
		sendBtn.disabled = false;
		connectBtn.disabled = true;
		dataChannel = newDataChannel;

		dataChannel.addEventListener("message", handleDataChannelMessage);
		dataChannel.addEventListener("close", handleDataChannelClose);

		function handleDataChannelMessage(event) {
			addMessage(`<b>${socketId}:</b> ${event.data}`);
		}

		function handleDataChannelClose() {
			console.log("close");
			connectedSocketId.textContent = "null";
			sendBtn.disabled = true;
			connectBtn.disabled = false;
			dataChannel = null;
		}
	}

	function handleSocketConnect() {
		const socketIdSpan = document.getElementById("socketId");
		socketIdSpan.textContent = socket.id;
	}

	function handleClickSendMessageBtn() {
		if (!dataChannel) {
			throw new Error("Requires DataChannel to send");
		}

		const message = messageInput.value;
		dataChannel.send(message);
		addMessage(`<b>me:</b> ${message}`);
	}
}

main();
