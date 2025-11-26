const express = require('express');
const router = express.Router();
const { doSomeTasks } = require('../utils/slowFunction');
const logger = require('../utils/logger');

router.get('/', async (req, res) => {
  logger.info('Slow endpoint accessed');
  try {
    const time = await doSomeTasks();
    return res.json({ status: 'success', message: `task completed in ${time} ms` });
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    return res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
