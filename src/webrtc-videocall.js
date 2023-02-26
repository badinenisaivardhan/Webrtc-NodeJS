const { io } = require("socket.io-client");
const {
	createRTCConnectionManager,
	RTCConnectionHandler,
	RTCConnectionManager
}  = require("rtc-socket-connector-client");

function main() {
	// Get HTML elements
	const connectBtn = document.getElementById("connectBtn") ;
	const socketIdSpan = document.getElementById("socketId");
	const myVideo = document.getElementById("myVideo");
	const targetInput = document.getElementById("targetInput");
	const targetVideo = document.getElementById("targetVideo");
	// 1. Connect to socket.io server
	const socket = io("http://localhost:5000");
	let rtcConnectionManager = RTCConnectionManager ;

	socket.on("connect", () => {
		socketIdSpan.innerHTML = socket.id;
	});

	// 2. Define RTCConnectionHandler
	const rtcConnectionHandlers = {
		onTrack: (socketId, streams) => {
			setStreamToVideoElement(streams[0], targetVideo);
			console.log(`track from socketId: ${socketId}`);
		},
	};

	// 3. Create RTCConnectionManager
	rtcConnectionManager = createRTCConnectionManager(
		socket,
		rtcConnectionHandlers
	);

	// 4. Set MediaStream
	getUserMedia().then((myMediaStream) => {
		rtcConnectionManager.setMediaStream(myMediaStream);
	});

	connectBtn.addEventListener("click", () => {
		// 5. Connect to another client
		rtcConnectionManager.connect(targetInput.value, {
			enableDataChannel: false,
			enableMediaStream: true,
		});
	});

	
	// Functions
	function getUserMedia() {
		return new Promise ((resolve) => {
			const constraints = { audio: false, video: true };

			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(function (mediaStream) {
					setStreamToVideoElement(mediaStream, myVideo);
					resolve(mediaStream);
				});
		});
	}

	function setStreamToVideoElement(stream,video) {
		video.srcObject = stream;
		video.onloadedmetadata = function () {
			video.play();
		};
	}
}

main();
