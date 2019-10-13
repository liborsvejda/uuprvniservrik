const http = require('http');

const PORT = 8888;

http.createServer((req, res) => {
    res.writeHead(200, {"Content-type": "text/html"});
    res.end("<html><body>Kuk!</body></html>");
}).listen(PORT);

console.log(`Server běží na adrese http://localhost:${PORT}...`);