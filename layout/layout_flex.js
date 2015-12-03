
// Wait till page is loaded before resizing

document.addEventListener('DOMContentLoaded', function(){
  
  // Get usable device screen dimensions

  deviceWidth = Math.min(window.innerWidth, window.outerWidth);
  deviceHeight = Math.min(window.innerHeight, window.outerHeight);
  
  // Print values to console
  
  console.log('Width: ' + deviceWidth);   
  console.log('Height: ' + deviceHeight);

}, false);

document.addEventListener('WebComponentsReady', function() {

var globalState = new Uint8Array([0,0,0,0,0,0]);

  var BLEDevice = document.querySelector('platinum-bluetooth-device');
  //var button = document.querySelector('paper-button');
  
  var button      = document.querySelector("#gamepad-green"); // Bruk ID i HTML og "#somename" syntax for å skille mellom knapper
  var btnForward  = document.querySelector("#gamepad-up");
  var btnBack     = document.querySelector("#gamepad-down");
  var btnLeft     = document.querySelector("#gamepad-left");
  var btnRight    = document.querySelector("#gamepad-right");
  var btnUp       = document.querySelector("#gamepad-blue");
  var btnDown     = document.querySelector("#gamepad-orange");
  
  var characteristic = document.querySelector('platinum-bluetooth-characteristic');
  
  button.addEventListener('click', function() {
    console.log('Requesting a bluetooth device advertising custom 128-bit UUID service...');
    updateStatus('Requesting BLE Device...');
    BLEDevice.request().then(function(device) {
      console.log('A bluetooth device has been found!');
      console.log('Device Name: ' + device.name);
      updateStatus('Found ' + device.name);
      
      // Neccessary to avoid delay on first button press
      var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
      return characteristicData.read().then(function(value) {
      var data = new DataView(value);
      console.log('Custom characteristic value is ' + data.getUint8(0) );
      updateStatus('Characteristic read. Ready to play!');
      });
    })
    .catch(function(error) {
      console.error('Argh! ', error);
      //updateStatus('Error', error);
    });
  });
  
  // Forward button functionality *****************************************************
  
  btnForward.addEventListener('touchstart', function() {
    
    var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
    var newData = new Uint8Array([1, 0, 0, 0, 0, 0]);
    return characteristicData.write(newData).then(function() {
      console.log('Characteristic was written: ' + newData);
      updateStatus(newData);
    })
    .catch(function(error) {
      console.error('Argh! ', error);
    });
  });
  
  btnForward.addEventListener('touchend', function() {
      console.log('Delay 150ms');
      setTimeout(function(){
      var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
      var newData = new Uint8Array([0, 0, 0, 0, 0, 0]);
      return characteristicData.write(newData).then(function() {
        console.log('Characteristic was written: ' + newData);
        updateStatus(newData);
      });
    }, 150); // delay to avoid uncaught button actions
  });
    
    // Back button functionality *****************************************************
  
    btnBack.addEventListener('touchstart', function() {
      
      var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
      var newData = new Uint8Array([0, 1, 0, 0, 0, 0]);
      return characteristicData.write(newData).then(function() {
        console.log('Characteristic was written: ' + newData);
        updateStatus(newData);
      });
    });
  
      btnBack.addEventListener('touchend', function() {
      console.log('Delay 150ms');
      setTimeout(function(){
        var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
        var newData = new Uint8Array([0, 0, 0, 0, 0, 0]);
        return characteristicData.write(newData).then(function() {
          console.log('Characteristic was written: ' + newData);
          updateStatus(newData);
        });

      }, 150); // delay to avoid uncaught button actions
    });  
  
  // Left button functionality *****************************************************
  btnLeft.addEventListener('touchstart', function() {
    var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
    var newData = new Uint8Array([0, 0, 1, 0, 0, 0]);
    return characteristicData.write(newData).then(function() {
      console.log('Characteristic was written: ' + newData);
      updateStatus(newData);
    });
  });
  
  btnLeft.addEventListener('touchend', function() {
    console.log('Delay 150ms');
    setTimeout(function(){
      var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
      var newData = new Uint8Array([0, 0, 0, 0, 0, 0]);
      return characteristicData.write(newData).then(function() {
        console.log('Characteristic was written: ' + newData);
        updateStatus(newData);
      });

    }, 150); // delay to avoid uncaught button actions
  });  
  
  // Right button functionality *****************************************************
  btnRight.addEventListener('touchstart', function() {
    var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
    var newData = new Uint8Array([0, 0, 0, 1, 0, 0]);
    return characteristicData.write(newData).then(function() {
      console.log('Characteristic was written: ' + newData);
      updateStatus(newData);
    });
  });
  
  btnRight.addEventListener('touchend', function() {
    console.log('Delay 150ms');
    setTimeout(function(){
      var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
      var newData = new Uint8Array([0, 0, 0, 0, 0, 0]);
      return characteristicData.write(newData).then(function() {
        console.log('Characteristic was written: ' + newData);
        updateStatus(newData);
      });

    }, 150); // delay to avoid uncaught button actions
  });  
  
  // Up button functionality *****************************************************
  btnUp.addEventListener('touchstart', function() {
    var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
    var newData = new Uint8Array([0, 0, 0, 0, 1, 0]);
    return characteristicData.write(newData).then(function() {
      console.log('Characteristic was written: ' + newData);
      updateStatus(newData);
    });
  });
  
  btnUp.addEventListener('touchend', function() {
    console.log('Delay 150ms');
    setTimeout(function(){
      var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
      var newData = new Uint8Array([0, 0, 0, 0, 0, 0]);
      return characteristicData.write(newData).then(function() {
        console.log('Characteristic was written: ' + newData);
        updateStatus(newData);
      });

    }, 150); // delay to avoid uncaught button actions
  }); 
  
  // Down button functionality *****************************************************
  btnDown.addEventListener('touchstart', function() {
    var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
    var newData = new Uint8Array([0, 0, 0, 0, 0, 1]);
    return characteristicData.write(newData).then(function() {
      console.log('Characteristic was written: ' + newData);
      updateStatus(newData);
    });
  });
  
  btnDown.addEventListener('touchend', function() {
    console.log('Delay 150ms');
    setTimeout(function(){
      var characteristicData = BLEDevice.querySelector('platinum-bluetooth-characteristic');
      var newData = new Uint8Array([0, 0, 0, 0, 0, 0]);
      return characteristicData.write(newData).then(function() {
        console.log('Characteristic was written: ' + newData);
        updateStatus(newData);
      });

    }, 150); // delay to avoid uncaught button actions
  });   
});

function updateStatus(newContent){
  document.querySelector("#statusMessage").innerHTML = newContent;
}



