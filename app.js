var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var shortid = require('shortid');

http.listen(3000);

app.use("/scripts", express.static(__dirname + '/js'));

app.get('/index', function(req, res){
  res.sendFile(__dirname + '/html/index.html');
});

app.get('/:id', function(req, res){
  var user_agent = req.headers['user-agent'];

  if(user_agent.indexOf('Android') > -1 || user_agent.indexOf('iPhone') > -1) {
  	res.sendFile(__dirname + '/html/sample_mobile.html');
  } else {
  	res.sendFile(__dirname + '/html/sample_desktop.html');
  }
});

io.on('connection', function(socket){
  var _socket_id = shortid.generate();

  console.log('a user connected : room - ' + _socket_id);
  socket.emit('generate', _socket_id);

  socket.on('join', function(socket_id) {
  	socket.room = socket_id;
  	socket.join(socket_id);
  	console.log('join : ' + socket_id + "\n rooms " + socket.rooms);
  	var clients = io.sockets.adapter.rooms[socket_id];
	console.log(clients);
  });
 
  socket.on('gyro', function(o){
    console.log(socket.room + ' message: x: ' +  o.x + ' y: ' + o.y + ' z: ' + o.z 
    	+ '\n' + 'alpha: ' + o.alpha + ' beta: ' + o.beta + ' gamma: ' + o.gamma + '\n');
        
    io.sockets.to(socket.room).emit('desktop', o);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected : room -' + socket.room);
    io.sockets.to(socket.room).emit('disconnected');
  });
});

