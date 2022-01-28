const host = process.env.HOST || "0.0.0.0"
const port = process.env.PORT || 8080

// const ALLOWED_HOSTS = ["fantasy.premierleague.com"]
const ALLOWED_HOSTS = "*"
const ENABLE_CACHE = process.env.ENABLE_CACHE

const server = require("express")()
const proxy = require("http-proxy").createProxyServer()
const url = require("url")
const cache = require("./cache")

const reqHash = require("request-hash")({
  algorithm: "md5",
  cookies: [],
  headers: [],
})

proxy.on("proxyRes", function (proxyRes, req, res) {
  let body = [];
  proxyRes.on('data', function (chunk) {
      body.push(chunk);
  });
  proxyRes.on('end', function () {
      body = Buffer.concat(body).toString();
      if (body && ENABLE_CACHE) {
        cache.set(reqHash(req, body), body)
      }
      res.end(body);
  });
})
proxy.on("error", function (err, req, res) {
  res.end(JSON.stringify({ error: "lol"}));
})

server.use(require("cors")())
server.use(require("compression")())

server.get("*", function (req, res) {
  try {

    const path = req.originalUrl
    if (path === "/") {
      return res.send("Hello there")
    } else {
      const formattedPath = path.slice(1)
      const proxyUrl = url.parse(formattedPath)
      console.log(`REQUESTED URL: ${formattedPath}`)
      if (ALLOWED_HOSTS === "*" || ALLOWED_HOSTS.includes(proxyUrl.host)) {
        if (ENABLE_CACHE) {

          const cached = cache.get(reqHash(req))
          if (cached) {
            console.log("CACHE HIT")
            res.send(cached)
            return
          }
        }
        const target = "https://" + proxyUrl.host + proxyUrl.path
        console.log(`HOST PERMITTED, PROXY TARGET: ${target}`)
        return proxy.web(req, res, {
          target,
          changeOrigin: true,
          ignorePath: true,
          selfHandleResponse: true
        })
      } else {
        console.log(`HOST DENIED`)
        res.statusCode = 403
        return res.send(`host ${proxyUrl.host} not allowed`)
      }
    }
  } catch (err) {
    console.log("caught", err)
    throw err
  }
})

server.use(function (err, req, res, next) {
  res.status(500).send("nah")
})

server.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
