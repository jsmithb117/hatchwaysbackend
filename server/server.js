const express = require('express');
const app = express()
const PORT = 3000

const API = "https://api.hatchways.io/assessment/blog/posts"

app.get('/api/ping', (req, res) => {
  res.send({"success": true})
})

app.listen(PORT, () => {
  console.log(`Express server listening at http://localhost:${PORT}`)
})