const http = require('http');

const PORT = 8888;
const VERSION = "0.0.1";

let numReq = 0;

http.createServer((req, res) => {
    if (req.url === "/favicon.ico") {
        res.writeHead(404);
        res.end();
        return;
    }
    numReq++;
    if (req.url.startsWith("/api/")) {
        res.writeHead(200, {"Content-type": "application/json"});
        let obj = {};
        if (req.url === "/api/appinfo") {
            obj.version = VERSION;
            obj.author = "Libor Švejda";
        } else if (req.url === "/api/reqnum") {
            obj.numberOfRequests = numReq;
        } else {
            obj.error = "API not found";
        }
        res.end(JSON.stringify(obj));
    } else if (req.url === "/appinfo") {
        res.writeHead(200, {"Content-type": "text/html"});
        res.end(`<html><meta charset="UTF-8"><body><h1>První servřík</h1>Verze: ${VERSION}</body></html>`);
    } else {
        res.writeHead(200, {"Content-type": "text/html"});
        res.end(`<html><meta charset="UTF-8"><body>Počet požadavků: ${numReq}</body></html>`);
    }
}).listen(PORT);

console.log(`Server běží na adrese http://localhost:${PORT}...`);