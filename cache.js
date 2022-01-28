const fs = require("fs")

const CACHE_PATH = __dirname + "/cache.json"

const cache = {
  set: (key, value) => {
    const cacheFile = fs.readFileSync(CACHE_PATH, { encoding: "utf-8"})
    const json = JSON.parse(cacheFile)
    json[key] = value
    fs.writeFileSync(CACHE_PATH, JSON.stringify(json))
    return
  },
  get: (key) => {
    const cacheFile = fs.readFileSync(CACHE_PATH, { encoding: "utf-8"})
    const json = JSON.parse(cacheFile)
    const value = json[key]
    return value
  }
}

module.exports = cache
