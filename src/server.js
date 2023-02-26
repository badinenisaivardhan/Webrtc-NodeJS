const socketIo = require("socket.io");
const express = require("express");
const {addRTCConnectionHandlers} = require("rtc-socket-connector-server");

function startServer(port) {
	const app = express();

	app.set('view engine', 'ejs');

	app.use(express.static('public'))

	app.get('/videocall',(req,res)=>{
		res.render('videocall')
	})

	app.get('/chat',(req,res)=>{
		res.render('chat')
	})

	
	const server = app.listen(port, () => {
		console.log(`listening on ${port}`);
	});
	const socketServer = new socketIo.Server(server, {
		cors: { origin: '*' },
	});

	addRTCConnectionHandlers(socketServer, {
		debug: true
	});
}

startServer(process.env.PORT || 5000);
