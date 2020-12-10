require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { router } = require('./src/routes');

const app = express();

//Middlewares
app.use(express.json());
app.use(cors());
app.use(process.env.API_VERSION, router);

const PORT = process.env.PORT || 6788;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
