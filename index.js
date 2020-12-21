const host = process.env.HOST || "0.0.0.0"
const port = process.env.PORT || 8080

const ALLOWED_HOSTS = ["fantasy.premierleague.com"]

const server = require("express")()
const proxy = require("http-proxy").createProxyServer()
const url = require("url")

server.use(require("cors")())
server.use(require("compression")())

server.get("*", function (req, res) {
  const path = req.path
  if (path === "/") {
    return res.send("Hello there")
  } else {
    const proxyUrl = url.parse(path.slice(1))
    if (ALLOWED_HOSTS.includes(proxyUrl.host)) {
      return proxy.web(req, res, {
        target: "https://" + proxyUrl.host + proxyUrl.path,
        changeOrigin: true,
        ignorePath: true
      })
    } else {
      res.statusCode = 403
      return res.send(`host ${proxyUrl.host} not allowed`)
    }
  }
})

server.use(function (err, req, res, next) {
  res.status(500).send("nah")
})

server.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
