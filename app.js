const express = require('express');
const router = require('./routes');
const app = express();

//db config
require('./config/dbconfig')
//db association
require('./config/dbassociation');

const fileUpload = require('express-fileupload');
const cors = require('cors');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//cors for client connection
app.use(cors()); 

//file upload middleware
app.use(fileUpload({
  createParentPath: true,
  preserveExtension: 3,
  useTempFiles: true,
  tempFileDir: "./temp",
  limits: { fileSize: 25 * 1024 * 1024 },
  uploadTimeout: 60000 //upload time out is 1min. make changes to it as you see fit
}));

app.use('/api/v1', router);

app.listen(process.env.PORT, () => console.log(`Server started on ${process.env.PORT}`));