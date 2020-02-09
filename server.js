/*


Using tutorial from: https://www.youtube.com/watch?v=0oXYLzuucwE&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=1

Current Video: https://www.youtube.com/watch?v=WDrU305J1yw&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=6


*/

const http = require('http');
const app = require('./app');

const port = 9000; //process.env.PORT is env variable, needs to be set. Can use const port = process.env.PORT || 9000 to chose port 9000 if env is unavailable

const server = http.createServer(app);

server.listen(port);
