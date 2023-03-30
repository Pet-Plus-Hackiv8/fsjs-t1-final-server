if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require('express')
const app = express()
const cors = require("cors");
const port = process.env.PORT || 4001
const Controller = require('./controllers/controller');
const errorHandler = require("./middlewares/errorHandler");



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post("/register", Controller.register)
app.post("/login", Controller.login)
app.put("/user/:id", Controller.putUser)
// app.get("/user/:id", Controller.fetchOnlineUser)
app.post("/pet", Controller.addPet)
app.get("/pets", Controller.fetchAllPet)
app.get("/pets/:id", Controller.fetchPet)
app.put("/pets/:id", Controller.putPet)
app.delete("/pets/:id", Controller.deletePet)

app.use(errorHandler)






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})