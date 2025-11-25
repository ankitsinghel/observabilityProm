const express = require("express");
const client = require("prom-client");  //for metric collection
const { doSomeTasks } = require("./utils/slowFunction");

const app = express()

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({register: client.register});


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