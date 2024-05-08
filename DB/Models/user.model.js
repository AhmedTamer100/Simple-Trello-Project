import mongoose , { Schema } from 'mongoose'

const userSchema = new Schema(
{
  FirstName:{
    type:String,
    required:true
  },
  LastName:{
    type:String,
    required:true
  },
  Username:{
    type:String,
    required:true,
    lowercase:true,
    //Concating First and Last Name
    default: function(){
      return (this.FirstName + this.LastName).toLowerCase()
    }
  },
  Email:{
    type:String,
    required:true,
    unique:true
  },
  Password:{
    type:String,
    required:true,
  },
  Day:{
    type:Number,
    required:true
  },
  Month:{
    type:Number,
    required:true
  },
  Year:{
    type:Number,
    required:true
  },
  Age:{
    type:Number,
    default:function(){
        const data_of_birth = new Date(this.Year,this.Month,this.Day)
        const ageDiffwithMs=Date.now() - data_of_birth
        const ageDate = new Date(ageDiffwithMs)
        return Math.abs(ageDate.getUTCFullYear() - 1970)
    }
  },
  Gender:{
    type:String,
    enum:['male','female','not specified'],
    default:'not specified'
  },
  Phone:{
    type:String,
    required:true
  },
  IsOnline:{
    type:Boolean,
    default:false
  },
  IsDeleted:{
    type:Boolean,
    default:false
  }
},
   {
    timestamps:true
   }
)

export const usermodel = mongoose.model('User',userSchema)