const http = require('http');
const request = require('request');

const hostname = '127.0.0.1';
const port = 8010;
const imgPort = 8011;

//API proxy server
const apiServer = http.createServer((req, res) => {
    console.log(req.url);
    const url = 'http://news-at.zhihu.com/api/4' + req.url;
    const option = {
        url: url
    };
    request.get(option, (error, response, body) => {
        if(!error && response.statusCode === 200){
            //Set encode type to display Chinese character
            res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            //console.log(body);
            res.end(body);
        }
    });
});

//Api server lisens to port 8010
apiServer.listen(port, hostname, () => {
    console.log(`API proxy server is running on port 8010.`);
});

//Image proxy server
const imgServer = http.createServer((req, res) => {
    const url = req.url.split('/img/')[1];
    const option = {
        url: url,
        encoding: null
    };
    request.get(option, (error, response, body) => {
        if(!error && response.statusCode === 200){
            //Set encode type to display Chinese character
            res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(body);
        }
    });
});

//Image server lisens to port 8011
imgServer.listen(imgPort, hostname, () => {
    console.log(`Image proxy server is running on port 8010.`);
});
