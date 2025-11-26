const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.send('Hello, World!');
});

module.exports = router;
