## usage

```js
var kt = new KeepInTouch({
  lostInterval: 1000
})

kt.connected(function () {
  console.log('connected')
})

kt.lost(function () {
  console.log('lost connection')
})

kt.every(5000, function () {
  console.log('connection lasts for another 5s')
})

// call kt.touch() at your frequency
setInterval(function () {
  kt.touch()
}, 800)
```
