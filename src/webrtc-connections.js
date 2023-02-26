const  { createRTCConnectionManager, RTCConnectionHandler } = require ("rtc-socket-connector-client");
const  {io} =  require("socket.io-client");

function main(){
  // Get HTML elements
  const connectedSocketId = document.getElementById("connectedSocketId") ;
  const connectBtn = document.getElementById("connectBtn") ;
  const targetInput = document.getElementById("targetInput") ;
  const socketId = document.getElementById("socketId") ;

  // 1. Connect to socket.io server
  const socket = io("http://localhost:5000");
  socket.on("connect", handleSocketConnect);

  // 2. Define RTCConnectionHandler
  const rtcConnectionHandler ={
    onRTCPeerConnection: (socketId, rtcPeerConnection) => {
      rtcPeerConnection.addEventListener("connectionstatechange", () => {
        console.log(`connectionstatechange::: socket id:${socketId} state:${rtcPeerConnection.connectionState}`)
        if(rtcPeerConnection.connectionState === "connected"){
          connectedSocketId.textContent = socketId;
        }
      })
    }
  }

  // 3. Create RTCConnectionManager
  const rtcConnectionManager = createRTCConnectionManager(socket, rtcConnectionHandler);

  connectBtn.addEventListener('click', () => {
    // 4. Connect to another client
    rtcConnectionManager.connect(targetInput.value, {
      enableDataChannel: true
    });
  });


  function handleSocketConnect (){
    socketId.textContent = socket.id;
  };
}

main();