// content of index.js
const http = require('http')
var url = require('url');
var fs = require('fs');
var appRootPath = require('app-root-path');
var path = require('path');
const port = 4004

const requestHandler = (req, res) => {
//   response.end('Hello Node.js Server!')

  var requestUrl = url.parse(req.url);


    var fsPath;
    if (requestUrl.pathname === '/') {
        fsPath = path.resolve(appRootPath + '/public/index.html');
    }
    else {
        fsPath = path.resolve(appRootPath + '/public/' + requestUrl.pathname);
    }

    fs.stat(fsPath, function (err, stat) {
        if (err) {
            console.log('error occurred...' + err);
            return end(req, res);
        }

        try {
            if (stat.isFile()) {
                res.writeHead(200);
                fs.createReadStream(fsPath).pipe(res);
            }
            else {
                res.writeHead(500);
                end(req.res);
            }
        }
        catch(e) {
            end(req, res);
        }
    });
  // var url = request.url;
  // if(url ==='/about'){
  //     res.write('<h1>about us page<h1>'); //write a response
  //     res.end(); //end the response
  // }
}

function end(req, res) {
  res.end();
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if(err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});