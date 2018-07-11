const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());
app.use(express.static(path.join(__dirname, '../client/dist')));

const clientBundles = './client/dist/services';
const serverBundles = './templates/services';
const serviceConfig = require('../service-config.json');
const services = require('../loader.js')(clientBundles, serverBundles, serviceConfig);

const React = require('react');
const ReactDom = require('react-dom/server');
const Layout = require('../templates/layout');
const App = require('../templates/app');
const Scripts = require('../templates/scripts');

const renderComponents = (components, props = {}) => {
  return Object.keys(components).map(item => {
    let component = React.createElement(components[item], props);
    return ReactDom.renderToString(component);
  });
};

app.get('/items/:id', function(req, res) {
  let components = renderComponents(services, {itemid: req.params.id});
  res.end(Layout(
    'Proxy',
    App(...components),
    Scripts(Object.keys(services))
  ));
});


app.listen(port, (err)=> {
  err ? console.log('error connecting to server', err) : console.log('connected to server on port '+ port)
})
