const express = require("express");
const resTime = require("response-time"); //for measuring response time
const { excTime, reqCounter } = require("./utils/prom-client");
const slowRouter = require('./routes/slow');
const rootRouter = require('./routes/root');
const metricsRouter = require('./routes/metrics');
const app = express()


app.use(resTime((req, res, time) => {
    // console.log(req.originalUrl)
    reqCounter.inc();
    excTime.labels({
        method:req.method,
         route:req.originalUrl,
         code:res.statusCode}).observe(time); 
}));
app.use('/slow', slowRouter);
app.use('/', rootRouter);
app.use('/metrics', metricsRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});