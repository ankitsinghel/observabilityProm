const express = require("express");
const client = require("prom-client");  //for metric collection
const resTime = require("response-time"); //for measuring response time
const { doSomeTasks } = require("./utils/slowFunction");

const app = express()

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

app.use(resTime((req, res, time) => {
    reqCounter.inc();
    excTime.labels({
        method:req.method,
         route:req.url,
         code:res.statusCode}).observe(time); 
}));
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.get("/slow", async (req, res) => {
    try {
        const time = await doSomeTasks();
        return res.json({  status: "success", message: `task completed in ${time} ms` });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
});
//for throwig metrics we need a new endpoint
app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    res.send(await client.register.metrics());
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});