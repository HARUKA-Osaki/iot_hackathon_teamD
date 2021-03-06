(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ADT7410 = factory());
}(this, (function () { 'use strict';

  const ADT7410 = function(i2cPort, slaveAddress) {
    this.i2cPort = i2cPort;
    this.i2cSlave = null;
    this.slaveAddress = slaveAddress;
  };

  ADT7410.prototype = {
    init: async function() {
      this.i2cSlave = await this.i2cPort.open(this.slaveAddress);
    },
    read: async function() {
      if (this.i2cSlave == null) {
        throw new Error("i2cSlave is not open yet.");
      }

      const MSB = await this.i2cSlave.read8(0x00);
      const LSB = await this.i2cSlave.read8(0x01);
      const binaryTemperature = ((MSB << 8) | LSB) >> 3;
      const sign = MSB & 0x10;
      // Under 13bit resolution mode. (sign + 12bit)
      if (sign === 0) {
        // Positive value
        return binaryTemperature / 16.0;
      } else {
        // Negative value
        return (binaryTemperature - 8192) / 16.0;
      }
    }
  };

  return ADT7410;

})));