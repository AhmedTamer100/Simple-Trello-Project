import express from 'express'
import path from 'path'
import { config } from 'dotenv'
import { ConnectionDB } from './DB/connection.js'
config({path:path.resolve('./config/config.env')})
import * as allRouters from './src/modules/index.routes.js'

const app=express()
const port=process.env.PORT

app.use(express.json())
ConnectionDB()
app.use('/Users',allRouters.userRouter)
app.use('/Tasks',allRouters.taskRouter)



app.listen(port,()=>console.log(`Server Connected`))