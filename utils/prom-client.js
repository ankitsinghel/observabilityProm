const client = require("prom-client");  //for metric collection

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({register: client.register});

const excTime= new client.Histogram({
    name: "execution_time_histogram",
    help: "Histogram for execution time of doSomeTasks",
    labelNames: ["method", "route", "code"],
    buckets: [1, 10, 20, 100, 200, 500, 1000, 2000, 4000] 
});

const reqCounter = new client.Counter({
    name: "request_counter",
    help: "Counter for total requests received",
    labelNames: ["method", "route", "code"]
});

module.exports = {
    excTime,
    reqCounter,
};