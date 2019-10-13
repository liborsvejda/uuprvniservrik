const http = require('http');

const PORT = 8888;

let numReq = 0;

http.createServer((req, res) => {
    if (req.url === "/favicon.ico") {
        res.writeHead(404);
        res.end();
        return;
    }
    numReq++;
    res.writeHead(200, {"Content-type": "text/html"});
    res.end(`<html><meta charset="UTF-8"><body>Počet požadavků: ${numReq}</body></html>`);
}).listen(PORT);

console.log(`Server běží na adrese http://localhost:${PORT}...`);