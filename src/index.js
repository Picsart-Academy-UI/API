const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

const { router } = require('./routes');

const app = express();

// Middlewares
app.use(express.json());

app.use(cors());

app.use(process.env.API_VERSION, router);

const PORT = process.env.PORT || 6788;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App is running on port ${PORT}`);
});
