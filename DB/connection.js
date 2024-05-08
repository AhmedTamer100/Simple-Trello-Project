import mongoose from 'mongoose'

export const ConnectionDB=async()=>{
    return await mongoose
    .connect(process.env.DB_CONNECTION_URL)
    .then((res)=>console.log('DB Connected Successfully'))
    .catch((err)=>console.log('DB Connection Failed'))
}