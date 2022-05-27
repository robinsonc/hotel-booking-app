import router from './routes/route';
const Express = require('express');
const Mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = Express();
app.use(Express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));

// Api route
app.use('/api/v1', router);

// connect to db
Mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.log(`Could not connect to MongoDB...${err}`))

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));

module.exports = app; // for testing