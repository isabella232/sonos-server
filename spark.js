var Spark = require('spark');

var sys = require('sys');
var exec = require('child_process').exec;
var child;

Spark.login({accessToken: '295f8bbb22d0e32cc4e6bdc53fd47724e5acc919'}, sparkConnected);

Spark.onEvent('prev', function(data) {
  console.log("Prev Event: " + data);

  try {
      child = exec("mpg123 /home/pi/mopidy-particle-controller/shame_sfx.mp3", function (error, stdout, stderr) {});
  } catch(er) {
    console.log('error playing the shame sound');
  }

});

Spark.onEvent('next', function(data) {
  console.log("Next Event: " + data);

  child = exec("curl -X POST -H Content-Type:application/json -d \'{\"method\": \"core.playback.next\",\"jsonrpc\": \"2.0\",\"params\": {},\"id\": 1}\' http://192.168.0.49:6680/mopidy/rpc", function (error, stdout, stderr) {});
});


Spark.onEvent('play', function(data) {
  console.log("Play Event: " + data);

  child = exec("curl -X POST -H Content-Type:application/json -d \'{\"method\": \"core.playback.play\",\"jsonrpc\": \"2.0\",\"params\": {\"tl_track\": null},\"id\": 1}\' http://192.168.0.49:6680/mopidy/rpc", function (error, stdout, stderr) {});
});

Spark.onEvent('stop', function(data) {
  console.log("Stop Event: " + data);

  child = exec("curl -X POST -H Content-Type:application/json -d \'{\"method\": \"core.playback.pause\",\"jsonrpc\": \"2.0\",\"params\": {},\"id\": 1}\' http://192.168.0.49:6680/mopidy/rpc", function (error, stdout, stderr) {
    // sys.print('stdout: ' + stdout);
    // sys.print('stderr: ' + stderr);
    // if (error !== null) {
    //   console.log('exec error: ' + error);
    // }
  });
});


var deviceReference = null;

function sparkConnected(err, body) {
  console.log('API call login completed on callback:', err, body);

  Spark.listDevices(getDevicesComplete);

}

function getDevicesComplete(err, devices) {
  var device = devices[0];

  console.log('Device name: ' + device.name);
  console.log('- connected?: ' + device.connected);
  console.log('- variables: ' + device.variables);
  console.log('- functions: ' + device.functions);
  console.log('- version: ' + device.version);
  console.log('- requires upgrade?: ' + device.requiresUpgrade);

  Spark.getDevice('sparkCore', deviceReadyHandler);
}

function deviceReadyHandler(err, device) {
  console.log('Device name ready: ' + device.name);
  deviceReference = device;

}
