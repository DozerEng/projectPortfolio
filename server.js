/*

Using tutorial from: https://www.youtube.com/watch?v=0oXYLzuucwE&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=1


*/

const http = require('http');
const app = require('./app');

const port = process.env.PORT; 

const server = http.createServer(app);

server.listen(port);
