(function (root, factory) {
    'use strict'
    /* istanbul ignore next */
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory()
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory)
    } else {
        // Browser globals
        root.KeepInTouch = factory()
    }
})(this, function () {
  'use strict'

  function KeepInTouch (options) {
    if (!(this instanceof KeepInTouch)) return new KeepInTouch(options)
    this.lostInterval = options ? options.lostInterval || 1000 : 1000
    this.everyInterval = null
    this.firstTouchTime = null
    this.lastTouchTime = null
    this.lostTimerId = null
    this.everyTimerId = null
    this.connectedCallback = null
    this.lostCallback = null
    this.everyCallback = null
    this.active = false
  }

  KeepInTouch.prototype = {
    constructor: KeepInTouch,

    _resetLostTimer: function () {
      var that = this
      clearTimeout(that.lostTimerId)
      that.lostTimerId = setTimeout(function () {
        that._lost()
      }, that.lostInterval)
    },

    _resetEveryTimer: function () {
      var that = this
      var everyCallback = that.everyCallback
      clearInterval(that.everyTimerId)
      that.everyTimerId = setInterval(function () {
        everyCallback && everyCallback()
      }, that.everyInterval)
    },

    _lost: function () {
      var duration = this.lastTouchTime - this.firstTouchTime
      clearInterval(this.everyTimerId)
      this.active = false
      this.lostTimerId = null
      this.everyTimerId = null
      this.lostCallback && this.lostCallback(duration)
    },

    // call this method to start and keep connection
    touch: function () {
      var now = Date.now()

      if (!this.active) {
        this.active = true
        this.firstTouchTime = now

        this.connectedCallback && this.connectedCallback()
        if (this.everyCallback) {
          this._resetEveryTimer()
        }
      }

      this.lastTouchTime = now
      this._resetLostTimer()
    },

    // when connected last every <internal>, will trigger the callback
    every: function (interval, callback) {
      this.everyInterval = interval
      this.everyCallback = callback
      if (this.active) {
        this._resetEveryTimer()
      }
    },

    // when it gets the connection, will trigger the callback
    connected: function (callback) {
      this.connectedCallback = callback
    },

    // when lost the connection, will trigger the callback
    lost: function (callback) {
      this.lostCallback = callback
    },

    stop: function () {
      this.active = false
      clearTimeout(this.lostTimerId)
      clearInterval(this.everyTimerId)
    }
  }

  return KeepInTouch
})
