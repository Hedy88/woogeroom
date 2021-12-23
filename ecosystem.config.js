module.exports = {
    apps : [{
      name   : "woogeroom-client",
      script : "cd frontend && npm build && cd .. && cp frontend /var/ww/woogeroom"
    }]
  }
  