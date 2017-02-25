var express = require('express');
var router = express.Router();
const rp = require('request-promise');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/geocode', function(req, res, next) {
  const actualBody = JSON.parse(Object.keys(req.body)[0]);
  const startingPoint = actualBody.startingPoint;
  const destination = actualBody.destination;
  const startingAddress = encodeURIComponent(startingPoint)
  const destinationAddress = encodeURIComponent(destination);

  const startingOpts = {
    uri: `https://maps.googleapis.com/maps/api/geocode/json?address=${startingAddress}&key=AIzaSyBNCMxUuSa4XRej2ax-Lk4vinZJeNOIsKA`
  }
  const coords = {};
  rp(startingOpts)
  .then(function(response) {
    const results = JSON.parse(response).results;
    const coordinates = results[0].geometry.location;
    coords.startingCoords = coordinates
    const destinationOpts = {
      uri: `https://maps.googleapis.com/maps/api/geocode/json?address=${destinationAddress}&key=AIzaSyBNCMxUuSa4XRej2ax-Lk4vinZJeNOIsKA`
    }
    return rp(destinationOpts)
  })
  .then(function(response) {
    const results = JSON.parse(response).results;
    const coordinates = results[0].geometry.location;
    coords.destinationCoords = coordinates
    res.send(coords)
  })
  .catch(function(err) {
    console.error(err)
    res.status(500).send(err);
  }) 
});

module.exports = router;
