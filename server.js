/*

Project Portfolio Server

*/

const fs = require('fs');
const http = require('http');
const https = require('https');
const app = require('./app');

const hostname = process.env.HOSTNAME;

const http_port = process.env.HTTP_PORT; 
const https_port = process.env.HTTPS_PORT; 

// const httpsOptions = {
//     cert: fs.readFileSync(process.env.CRT),
//     ca: fs.readFileSync(process.env.CA_BUNDLE),
//     key: fs.readFileSync(process.env.KEY)
// };

const httpServer = http.createServer(app);
//const httpsServer = https.createServer(httpsOptions, app);

httpServer.listen(http_port);
//httpsServer.listen(https_port, hostname);
