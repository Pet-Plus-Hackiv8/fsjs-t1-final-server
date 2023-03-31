if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require('express')
const app = express()
const cors = require("cors");
const port = process.env.PORT || 4001
const Controller = require('./controllers/controller');
const errorHandler = require("./middlewares/errorHandler");
const authentication = require("./middlewares/authentication")
const upload = require("./helpers/multer");



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post("/register", upload.single("imgUrl"), Controller.register)
app.post("/login", Controller.login)

app.use(authentication)

app.get("/user", Controller.getUserById)
app.put("/user", upload.single("imgUrl"), Controller.putUser)
// app.get("/user/:id", Controller.fetchOnlineUser)
app.post("/pets", Controller.addPet)
app.get("/pets", Controller.fetchAllPet)
app.get("/pets/:id", Controller.fetchPet)
app.put("/pets/:id", Controller.putPet)
app.delete("/pets/:id", Controller.deletePet)

app.use(errorHandler)






app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})