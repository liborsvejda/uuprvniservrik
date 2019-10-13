const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 8888;
const VERSION = "0.0.1";

let numReq = 0;
function fileRequested(req, res) {
    let q = url.parse(req.url, true);
    let fileName = q.pathname;
    if (fileName.indexOf(".") < 0 || fileName.length - fileName.indexOf(".") > 6) {
        return false;
    }
    if (fileName.charAt(0) === '/') {
        fileName = fileName.substr(1);
    }
    if (!fs.existsSync(fileName)) {
        console.log("### not exists");
        // res.writeHead(404);
        // res.end();
        return false;
    }
    let contentType = "application/octet-stream";
    if (fileName.toLowerCase().endsWith(".html")) {
        contentType = "text/html";
    } else if (fileName.toLowerCase().endsWith(".jpg") || fileName.endsWith(".jpeg")) {
        contentType = "image/jpeg";
    } else if (fileName.toLowerCase().endsWith(".png")) {
        contentType = "image/png";
    } else if (fileName.toLowerCase().endsWith(".pdf")) {
        contentType = "application/pdf"
    };
    let file = fs.createReadStream(fileName);
    file.on('open', function () {
        res.writeHead(200, {'Content-Type': contentType});
        file.pipe(res);
    });
    file.on('end', function () {
        res.end();
    });
    file.on('error', function () {
        res.writeHead(500);
        res.end();
    });
    return true;
}

http.createServer((req, res) => {
    if (req.url === "/favicon.ico") {
        res.writeHead(404);
        res.end();
        return;
    }
    numReq++;
    if (req.url === "/") {
        fs.readFile('index.html', function(err, data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } else if (fileRequested(req, res)) {
        return;
    } else if (req.url.startsWith("/api/")) {
        res.writeHead(200, {
            "Content-type": "application/json",
            //"Access-Control-Allow-Origin": "*"
        });
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