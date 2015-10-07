var net = require('net');
var HOST = '127.0.0.1';
var PORT = 9000;

// Create the server socket, on client connections, bind event handlers
server = net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('Conected: ' + sock.remoteAddress + ':' + sock.remotePort);
    
    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
        
        console.log('request comes in...' + data);
        var str = data.toString();
        var cmd = JSON.parse (str);
        console.log('request is:' + cmd.what + ':' + str);

        var reply = {what:cmd.what};
        switch (cmd.what) {
            case 'get message list': reply.obj = getMessageList ();
            break;
            case 'post message': reply.obj = postMessage (cmd.msg, cmd.from);
            break;
        }
        sock.write (JSON.stringify(reply));
    });


    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('Connection closed');
    });
    
});
    
server.listen(PORT, HOST, function () {
    console.log('Server listening on ' + HOST +':'+ PORT);
});

// Server state
var messages = [{msg:'primer mensaje', from:'Foreador', ts:new Date()},
                {msg:'SEGUNDO mensaje', from:'Foreador', ts:new Date()}];

// Server functions
getMessageList = function () {
    return messages;
}

// Posts a new message. Returns true.
postMessage = function (msg_, from_) {
    var post = {msg:msg_, from:from_, ts:new Date()};
    messages.push (post);
    return true; // success
}

