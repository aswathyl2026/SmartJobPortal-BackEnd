const express=require('express')
const cors=require('cors')
require('dotenv').config()
const routes=require('./routes/allRoutes')
require('./config/db')

const server=express()
server.use(cors())
server.use(express.json())
server.use(routes)
const PORT=process.env.PORT

server.listen(PORT,()=>{
    console.log(`Server statred at ${PORT}`);
    
})

//application specific midle ware
server.use((err,req,res,next)=>{
    res.status(500).json(err.message)
})

server.get('/',(req,res)=>{
 res.status(200).send(`<h1>Server started</h1>`)
})