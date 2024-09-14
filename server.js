import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import UserRouter from './Router/user.js'
import FeedbackRouter from './Router/feedback.js'

const app = express()

mongoose.connect('mongodb+srv://sangitpadhee:uaAzcditgNzXM3Hd@cluster0.xipks.mongodb.net/Santik-Automotive').then(()=> console.log("MongoDb Connexted Succesfully"))

app.use(express.json())
app.use(cors())

app.use('/api/user', UserRouter)
app.use('/api/user', FeedbackRouter)


app.listen(2004, ()=> console.log("Server Is Running On Port 2004"))