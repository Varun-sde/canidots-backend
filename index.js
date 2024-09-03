import express from "express"
import dotenv from "dotenv"
import mongoose, { model } from "mongoose"
dotenv.config()
const app = express()
const PORT = process.env.PORT
const COLLECTION = process.env.COLLECTION
const CONNECTION_STR = process.env.CONNECTION_STR

mongoose.connect(CONNECTION_STR)

const Schema = mongoose.Schema({
    test: Boolean
})

const Model = mongoose.model(COLLECTION,Schema)

async function call_DB_Data(){
    const data = await Model.findOne()
    console.log(data)
}
call_DB_Data()

app.get(`/`,(req,res)=>{
    res.send(`server runs...`)
})

app.listen(PORT)