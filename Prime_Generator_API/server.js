const http=require('http');
const app=require('./app');

/*
    create an HTTP server and listen on the given port.
    If environment variable PORT is set then it will be used as port number
    Else 8888 will be used as a port number
*/
const port=process.env.PORT || 8888;

// create a server object and register app object as requestListener
const server=http.createServer(app);

// listen to the incoming request
server.listen(port);

console.log('listening at '+port);