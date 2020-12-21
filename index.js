const host = process.env.HOST || "0.0.0.0"
const port = process.env.PORT || 8080

const ALLOWED_HOSTS = ["fantasy.premierleague.com"]

// const getProxyForUrl = require('proxy-from-env').getProxyForUrl;
// const corsProxy = require('cors-anywhere');
// corsProxy.createServer({
//     getProxyForUrl: (url) => {

//     }
//     // originWhitelist: ["https://fantasy.premierleague.com"],
// }).listen(port, host, function() {
//     console.log('Running CORS Anywhere on ' + host + ':' + port);
// });

// const Koa = require("koa")
// const route = require("koa-route")
// const url = require("url")
// const fetch = require("isomorphic-unfetch")
// const proxy = require("koa-proxy")

// const server = new Koa()

// server.use(async (ctx, next) => {
//   const { path, href, host, hostname, origin, headers } = ctx
//   console.log({ path, href, host, hostname, origin })
//   // throw new Error("huh")
//   if (path === "/") {
//     ctx.body = "Hello there"
//     return
//   } else {
//     const proxyUrl = url.parse(path.slice(1))
//     console.log({ proxyUrl })
//     // ctx.body = "proxying, are we?"
//     if (ALLOWED_HOSTS.includes(proxyUrl.host)) {
//       // ctx.body = "proxy away sir"
//       console.log({ proxyUrl })
//       // const resp = await fetch(proxyUrl.href, { headers })
//       // // const text = await resp.text()
//       // console.log(resp)
//       // const data = await resp.json()
//       // ctx.body = data
//       console.log("um")
//       return proxy({
//         url: "https://" + proxyUrl.host + proxyUrl.path,
//         requestOptions: { strictSSL: false, followRedirect: true }
//       })(ctx, next)
//     } else {
//       ctx.throw(403)
//     }
//   }
// })

const express = require("express")
const server = express()

const proxy = require("http-proxy").createProxyServer()
const url = require("url")

server.get("*", function (req, res) {
  const path = req.path
  if (path === "/") {
    res.send("Hello there")
    return
  } else {
    const proxyUrl = url.parse(path.slice(1))
    if (ALLOWED_HOSTS.includes(proxyUrl.host)) {
      console.log("um")
      return proxy.web(req, res, {
        target: "https://" + proxyUrl.host + proxyUrl.path,
        changeOrigin: true,
        ignorePath: true
      })
    } else {
      res.statusCode = 403
      res.send(`host ${proxyUrl.host} not allowed`)
    }
  }
})

server.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
