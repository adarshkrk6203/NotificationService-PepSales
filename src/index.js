  require('dotenv').config();
  const express = require('express');
  const bodyParser = require('body-parser');
  const router = require('./routes');
  const sequelize = require('./db');

  const app = express();
  app.use(bodyParser.json());
  app.use('/', router);

  (async () => {
    await sequelize.sync();
    const port = process.env.PORT || process.env.PORT;
    app.listen(port, () => console.log(`API running on port ${port}`));
  })();
