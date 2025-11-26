const express = require('express');
const router = express.Router();
const client = require('prom-client');
const logger = require('../utils/logger');

router.get('/', async (req, res) => {
  logger.info('Metrics endpoint accessed');
  res.setHeader('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

module.exports = router;
