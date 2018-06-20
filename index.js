const express = require('express');
const parser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.options('*', cors());
app.use(parser.json());
app.use(parser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '../client/dist')));

const port = 3000;

app.listen(port, (err)=> {
  err ? console.log('error connecting to server', err) : console.log('connected to server on port '+ port)
})
