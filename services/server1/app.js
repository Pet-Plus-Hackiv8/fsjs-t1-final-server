const express = require('express')
const app = express()
const port = process.env.PORT || 4001
const Controller = require('./controllers/controller');

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post("/register", Controller.register)
app.post("/login", Controller.login)
app.put("/user/:id", Controller.putUser)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})