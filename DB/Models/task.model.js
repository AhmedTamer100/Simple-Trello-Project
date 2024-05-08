import mongoose , { Schema, SchemaTypes } from 'mongoose'

const taskschema=new Schema(
   {
    Title:{
        type:String,
        required:true,
        lowercase:true
    },
    Description:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        enum:['toDo','doing','done'],
        default:'toDo'
    },
    userID:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    assignTo:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    deadline:{
        type:Date
    }
   } ,{
    timestamps:true
   }
)
export const taskmodel=mongoose.model('Task',taskschema)