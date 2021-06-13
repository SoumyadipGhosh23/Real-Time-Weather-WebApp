const http = require('http');
const fs = require("fs");
var requets = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%temp_min%}", orgVal.main.tem_min);
    temperature = temperature.replace("{%temp_max%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    
  
    return temperature;

};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Kolkata,WB,IN&appid=e4bcdccf5e43b72f65e67eb8922cbddf")
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                const realTimeData = arrData
                .map((val) => replaceVal(homeFile, val))
                .join("");
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
});

server.listen(8000);