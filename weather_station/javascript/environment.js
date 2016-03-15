'use strict'

/*  BLE Configuration Service
    deviceNameCharacteristicUUID - write/write without response - max 10 byte - ascii string
    advertisingParamCharacteristicUUID - write/write without response - 3 bytes - uint16_t adv interval in ms - uint8_t adv timeout in s
    appearanceCharacteristicUUID - write/write without response - 2 bytes - uint16_t appearance
    connectionParamCharacteristicUUID - write/write without response - 8 bytes - uint16_t min conn interval - uint16_t max conn interval - uint16_t slave latency - uint16_t supervision timeout
*/
var configurationServiceUUID = 'ef680001-9b35-4933-9b10-52ffa9740042';
var deviceNameCharacteristicUUID = 'ef680002-9b35-4933-9b10-52ffa9740042';
var advertisingParamCharacteristicUUID = 'ef680003-9b35-4933-9b10-52ffa9740042';
var appearanceCharacteristicUUID = 'ef680004-9b35-4933-9b10-52ffa9740042';
var connectionParamCharacteristicUUID = 'ef680005-9b35-4933-9b10-52ffa9740042';

/*  Weather Station Service
    temperatureCharacteristicUUID - notify/read - 2 bytes - uint8_t integer - uint8_t decimal
    pressureCharacteristicUUID - notify/read - 5 bytes - int32_t integer - uint8_t decimal
    humidityCharacteristicUUID - notify/read - 1 byte - uint8_t
    configurationCharacteristicUUID - write/write without response - 7 bytes - uint16_t temp interval in ms - uint16_t pressure interval in ms - uint16_t humidity interval in ms - uint8_t pressure mode (0=barometer, 1=altimeter)
*/
var weatherStationServiceUUID = '20080001-e36f-4648-91c6-9e86ead38764';
var temperatureCharacteristicUUID = '20080002-e36f-4648-91c6-9e86ead38764';
var pressureCharacteristicUUID = '20080003-e36f-4648-91c6-9e86ead38764';
var humidityCharacteristicUUID = '20080004-e36f-4648-91c6-9e86ead38764';
var gasCharacteristicUUID = '20080005-e36f-4648-91c6-9e86ead38764';
var configurationCharacteristicUUID = '20080006-e36f-4648-91c6-9e86ead38764';

/*  User Interface Service
    ledCharacteristicUUID - write/read - 4 bytes - uint32_t - LED ID - Red - Green - Blue (LSB)
    buttonCharacteristicUUID - write/read - 2 bytes - uint16_t - Button 2 state - Button 1 state (LSB)
*/
var userInterfaceServiceUUID = 'C7AE0001-3266-4A5C-859F-0F4799146BB5';
var ledCharacteristicUUID = 'C7AE0002-3266-4A5C-859F-0F4799146BB5';
var buttonCharacteristicUUID = 'C7AE0003-3266-4A5C-859F-0F4799146BB5';

var bleDevice;
var bleServer;
var bleService;
var tempBleService;
var gasChar;
var temperatureChar;
var pressureChar;
var humidityChar;

window.onload = function(){
  document.querySelector('#connect').addEventListener('click', getAll);
  document.querySelector('#disconnect').addEventListener('click', stopAll);
};

function log(text) {
    document.querySelector('#log').textContent += text + '\n';
    console.log(text);
}

function getAll() {
  if (!navigator.bluetooth) {
      log('Web Bluetooth API is not available.\n' +
          'Please make sure the Web Bluetooth flag is enabled.');
      return;
  }
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: [
    {services: [configurationServiceUUID]},
    {services: [weatherStationServiceUUID]}
    ]
  })
  .then(device => device.connectGATT())
  .then(server => {
    bleServer = server;
    log('Got bleServer');
    return server.getPrimaryService(weatherStationServiceUUID);
  })
  .then(service => {
    log('Got bleService');
    bleService = service;
    return Promise.all([
      service.getCharacteristic(temperatureCharacteristicUUID)
      .then(handleTemperature),
      service.getCharacteristic(humidityCharacteristicUUID)
      .then(handleHumidity),
      service.getCharacteristic(pressureCharacteristicUUID)
      .then(handlePressure),
      service.getCharacteristic(gasCharacteristicUUID)
      .then(handleGas)
    ])
  })
  .catch(error => {
    log('> getAll() ' + error);
  });
}

function handlePressure(characteristic){
  log('> handlePressure()');
  pressureChar = characteristic;
  //characteristic.addEventListener('characteristicvaluechanged',handleNotifyPressure);
  //return characteristic.startNotifications();
}

function handleTemperature(characteristic){
  log('> handleTemperature()');
  temperatureChar = characteristic;
  //temperatureChar.addEventListener('characteristicvaluechanged',handleNotifyTemperature);
  //return temperatureChar.startNotifications();
}

function handleHumidity(characteristic){
  log('> handleHumidity()');
  humidityChar = characteristic;
  //characteristic.addEventListener('characteristicvaluechanged',handleNotifyHumidity);
  //return characteristic.startNotifications();
}

function handleGas(characteristic){
  log('> handleGas()');
  gasChar = characteristic;
  gasChar.addEventListener('characteristicvaluechanged',handleNotifyGas);
  return gasChar.startNotifications();
}

function stopAll() {
    log('> stopAll()')
    gasChar.stopNotifications().then(() => {
        log('> Gas notification stopped');
    })
    .then(() => {
        gasChar.removeEventListener('characteristicvaluechanged',handleNotifyGas).then(() => {
            log('> Gas notification handler removed');
        })
    })
    .then(() => {
        // Disconnect only for Chrome OS 50+
        log('Disconnecting from Bluetooth Device...');
        if (bleServer.connected)
        {
          bleServer.disconnect();
          log('Bluetooth Device connected: ' + bleServer.connected);
        }
        else
        {
          log('Bluetooth Device is already disconnected');
        }
    })
    .catch(error => {
        log('> stopAll() ' + error);
    });
}

function handleNotifyGas(event) {
  let value = event.target.value;
  value = value.buffer ? value : new DataView(value);
  let eco2_ppm = (value.getUint8(1) << 8) + value.getUint8(0) ;
  log('eCO2 is ' + eco2_ppm + 'ppm');
  document.getElementById("eco2_reading").innerHTML = eco2_ppm + 'ppm';

  let tvoc_ppb = (value.getUint8(3) << 8) + value.getUint8(2);
  log('TVOC is ' + tvoc_ppb + 'ppb');
  document.getElementById("tvoc_reading").innerHTML = tvoc_ppb + 'ppb';
}

function handleNotifyTemperature(event) {
  let value = event.target.value;
  value = value.buffer ? value : new DataView(value);
  let temperature_int = value.getUint8(0);
  let temperature_dec = value.getUint8(1);
  log('Temperature is ' + temperature_int + '.' + temperature_dec + 'C');
  //document.getElementById("temperature_reading").innerHTML = temperature_int + '.' + temperature_dec + '&deg;C';
}

function handleNotifyHumidity(event) {
  let value = event.target.value;
  value = value.buffer ? value : new DataView(value);
  let humidity_int = value.getUint8(0);
  log('Humidity is ' + humidity_int + '%');
  //document.getElementById("humidity_reading").innerHTML = humidity_int +"%";
}

function handleNotifyPressure(event) {
  let value = event.target.value;
  value = value.buffer ? value : new DataView(value);
  let pressure_integer = value.getInt32(0, true);
  let pressure_decimal = value.getUint8(4);
  let pressure_pascal = pressure_integer + pressure_decimal / 1000;
  let pressure_hpascal = pressure_pascal / 100;
  log('Pressure is ' + pressure_hpascal + 'hPa');
  //document.getElementById("pressure_reading").innerHTML = pressure_hpascal.toFixed(3) + 'hPa';
}
