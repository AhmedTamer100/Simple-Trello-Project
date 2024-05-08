import { usermodel } from "../../../DB/Models/user.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
//=================================Sign Up=======================================
export const SignUp=async(req,res,next)=>{
  const{FirstName,LastName,Email,Password,Day,Month,Year,Gender,Phone,ConfirmPassword,role}=req.body
  const userCheck=await usermodel.findOne({Email})

  if(userCheck){
    return res.json({message:'Email is already exist'})
  }

  if(ConfirmPassword != Password){
    return res.json({message:'Password not match'})
  }
  const hashedPassword=bcrypt.hashSync(Password,+process.env.SALT_ROUNDS) //+ for parsing
  const records = new usermodel({FirstName,LastName,Email,Password:hashedPassword,Day,Month,Year,Gender,Phone,role})
  const save_records=await records.save()
  const genToken = jwt.sign({ id:save_records._id, Email:save_records.Email},process.env.TOKEN,{ expiresIn: '3h' })

  res.json({message:'Sign Up Successfully',save_records,token:genToken})
}

//=============================Login====================================
export const Login=async(req,res,next)=>{
  const{Email,Password}=req.body
  const Emailchecking=await usermodel.findOne({Email})
  if(!Emailchecking){
    return res.json({message:'Invalid Email OR Password'})
  }
  const Passwordchecking =bcrypt.compareSync(Password,Emailchecking.Password)
  if(!Passwordchecking){
    return res.json({message:'Invalid Email OR Password'})
  }
  const genToken = jwt.sign({ id:Emailchecking._id, Email:Emailchecking.Email},process.env.TOKEN,{ expiresIn: '3h' })

  await usermodel.findOneAndUpdate({Email:Emailchecking.Email},{IsOnline:true},{IsDeleted:false},{new:true})

  res.json({message:'Login Successfully',token:genToken})
}

//============================Change Password===========================
export const ChangePassword =async(req,res,next)=>{
  const{Email,Password,newPassword}=req.body
  const Emailchecking=await usermodel.findOne({Email})
  if(!Emailchecking){
    return res.json({message:'Invalid Email OR Password'})
  }
  const Passwordchecking=bcrypt.compareSync(Password,Emailchecking.Password)
  if(!Passwordchecking){
    return res.json({message:'Invalid Email OR Password'})
  }
  const hashhedPassword = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS)
  await usermodel.findOneAndUpdate({Email:Emailchecking.Email},{Password:hashhedPassword},{new:true})
  res.json({message:'Password Updated Successfully'})
}

//=========================Update User's=>(age,FirstName,LastName,Phone)======================
export const UpdateInfo=async(req,res,next)=>{
  const{userID}=req.query
  const{FirstName,LastName,Day,Month,Year,Phone}=req.body
  
  const userExists = await usermodel.findById(userID)
  if (!userExists) {
    return res.status(400).json({ message: 'in-valid userId' })
  }

  if (userExists._id.toString()!==userID) { 
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const newrec = await usermodel.findByIdAndUpdate(
    { _id: userID },
    { FirstName,LastName,Day,Month,Year,Phone },
    { new: true },
  )
  res.status(200).json({ message: 'updated Successfully', newrec })
}

//============================Delete User===============================
export const DeleteUser = async (req, res, next) => {
  const{Email,Password}=req.body
  const{userID}=req.query
  const Emailchecking=await usermodel.findOne({Email})
  if(!Emailchecking){
    return res.json({message:'Invalid Email OR Password'})
  }
  const Passwordchecking=bcrypt.compareSync(Password,Emailchecking.Password)
  if(!Passwordchecking){
    return res.json({message:'Invalid Email OR Password'})
  }
  if(Emailchecking._id.toString()!==userID){
    return res.status(401).json({ message: 'USER DOESNT EXIST' })
  }
  const deletion=await usermodel.findOneAndDelete({Email})
  return res.status(200).json({ message: 'Deleted Successfully' ,deletion})
}

//============================Soft Delete================================
export const SoftDelete=async(req,res,next)=>{
  const{Email,Password}=req.body
 
  const EmailExists=await usermodel.findOne({Email})
  if(!EmailExists){
    return res.json({message:'Invalid Email OR Password'})
  }
  const Passwordchecking=bcrypt.compareSync(Password,EmailExists.Password)
  if(!Passwordchecking){
    return res.json({message:'Invalid Email OR Password'})
  }
  const softdeletion=await usermodel.findOneAndUpdate(
    { Email:EmailExists.Email },
    { IsDeleted:true,IsOnline:false },
    { new: true },
  )
  res.status(200).json({ message: 'Temp Deleted Successfully', softdeletion })
}
//============================LOGOUT=====================================
export const LogOut=async(req,res,next)=>{
  const{Email,Password}=req.body

  const EmailCheck = await usermodel.findOne({Email})

  if(!EmailCheck){
    res.status(400).json({message : 'Invalid Email OR Password'})
  }

  const PasswordCheck=bcrypt.compareSync(Password,EmailCheck.Password)

  if(!PasswordCheck){
    res.status(400).json({message:'Invalid Email OR password'})
  }

  const logOut=await usermodel.findOneAndUpdate(
    {Email},
    {IsOnline:false},
    {new:true}
  )
  res.status(200).json({message:'Logged Out SuccessFully',logOut})
}
