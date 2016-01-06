var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var sonosModule = require('sonos');

sonosModule.search(function(device) {
  // device is an instance of sonos.Sonos
  this.sonos = device;

  // configure app to use bodyParser()
  // this will let us get the data from a POST
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  var port = 8080;

  // ROUTES FOR OUR API
  // =============================================================================
  var router = express.Router(); // get an instance of the express Router

  router.get('/', function(req, res) {
    var currentTrack = this.sonos.currentTrack(function (err, track) {
      if (!err) {
        res.json({ message: 'Success:: Sonos is working and now is playing: '+ track.title + ' by '+ track.artist});
      }
    });
  }.bind(this));

  router.post('/next', function(req, res) {
    this.sonos.next(function (err, nexted) {
      if (!err || !nexted) {
        res.send('Success:: Going to next song');
      } else {
        res.send('Failure:: Error going to next song');
      }
    });
  }.bind(this));

  router.post('/changeStatus', function(req, res) {
    this.sonos.getCurrentState(function (err, status) {
      if (!err) {
        if (status === 'playing') {
          this.sonos.pause(function (err) {
            if (!err) {
              res.send('Success:: Sonos is paused');
            } else {
              res.send('Failure:: Error stoping Sonos');
            }
          }.bind(this));
        } else if (status === 'paused') {
          this.sonos.play(function (err, playing) {
            if (!err) {
              res.send('Success:: Sonos is playing');
            } else {
              res.send('Failure:: Error playing Sonos');
            }
          }.bind(this));
        } 

      }
    }.bind(this));

  }.bind(this));

  router.post('/previous', function(req, res) {
    this.sonos.previous(function (err, previous) {
      if (!err || !previous) {
        res.send('Success:: Going to previous song');

      } else {
        res.send('Failure:: Error going to previous song');
      }
    });
  }.bind(this));

  // REGISTER OUR ROUTES -------------------------------
  // all of our routes will be prefixed with /api
  app.use('/api', router);

  // START THE SERVER
  // =============================================================================
  app.listen(port);
  console.log('Success:: Sonos server started at port ' + port);

}.bind(this));

