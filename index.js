const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const axios = require('axios');

// app.use(morgan('dev'));
app.use(cors());
app.options('', cors());
app.use(express.static(path.join(__dirname, './static')));

const clientBundles = './static/services';
const serverBundles = './templates/services';
const serviceConfig = require('./service-config.json');
const services = require('./loader.js')(clientBundles, serverBundles, serviceConfig);

const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('./templates/layout');
const App = require('./templates/app');
const Scripts = require('./templates/scripts');

const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props);
    return ReactDom.renderToString(component);
  });
};

app.get('/:primary_id', function(req, res) {
  let props = {primary_id: req.params.primary_id};
  let components = renderComponents(services, props);
  res.end(Layout(
    'Proxy',
    App(...components),
    Scripts(Object.keys(services), props)
  ));
});

app.get('/api/product/:id', (req, res) => {
  axios.get('http://52.87.249.24:8080/api/product/' + req.params.id)
  .then(({ data }) => res.send(data).status(200))
  .catch(err => res.send(err).status(404));
});

app.get('/api/reviews/:id', (req, res) => {
  axios.get('http://52.87.249.24:8080/api/reviews/' + req.params.id)
  .then(({ data }) => res.send(data).status(200))
  .catch(err => res.send(err).status(404));
});

app.post('/api/reviews/', (req, res) => {
  let body = { 
    customer_name: req.body.customer_name || 'Amazon Customer',
    rating: Number(req.body.rating),
    title: req.body.title,
    review: req.body.review,
    helpful_count: Number(req.body.helpful_count),
    product_id: Number(req.body.product_id),
    verified:  req.body.verified === 'true' ? true : false,
    updated_at: new Date(Date.now()).toISOString()
  };
  axios.post('http://52.87.249.24:8080/api/reviews/', body)
  .then(() => res.send().status(201))
  .catch(err => res.send(err).status(404));
});

app.post('/api/product/:name', (req, res) => {
  axios.post('http://52.87.249.24:8080/api/product/', req.params.name)
  .then(() => res.send().status(201))
  .catch(err => res.send(err).status(404));
});


app.get('/loaderio-914805f476bc203c6e49fd46951ef1c2', function(req, res) {
  res.send('loaderio-914805f476bc203c6e49fd46951ef1c2');
});

app.listen(port, (err)=> {
  err ? console.log('error connecting to server', err) : console.log('connected to server on port '+ port)
})
