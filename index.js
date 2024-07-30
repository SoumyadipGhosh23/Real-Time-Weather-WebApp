const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    // Convert temperature from Kelvin to Celsius
    const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);
    
    // Replace placeholders in the HTML template with real data
    let temperature = tempVal.replace("{%tempval%}", kelvinToCelsius(orgVal.main.temp));
    temperature = temperature.replace("{%temp_min%}", kelvinToCelsius(orgVal.main.temp_min));
    temperature = temperature.replace("{%temp_max%}", kelvinToCelsius(orgVal.main.temp_max));
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
                const realTimeData = replaceVal(homeFile, objdata);
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
});

server.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});
