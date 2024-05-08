import moment from "moment"
import { taskmodel } from "../../../DB/Models/task.model.js"
import { usermodel } from "../../../DB/Models/user.model.js"

//===================================Add Task===============================================
export const AddTask=async(req,res,next)=>{
  const{Title,Description,userID,assignTo,deadline}=req.body
  const isexist = await taskmodel.findOne({Title})
  if(isexist){
    return res.status(400).json({message:"Task Already Exists"})
  }
  const customTaskdate=moment(new Date(req.body.deadline)).format("YYYY MM DD")
  const saverec=new taskmodel({
    Title,
    Description,
    userID,
    assignTo,
    deadline:customTaskdate})   //Assign customTaskdate to deadline field

    const Task=await saverec.save()
    res.status(200).json({message:"Added Task SuccessFully",Task})
}
//=====================update TASK(title , description , status)and can assign to other user===================
export const UpdateTask =async(req,res,next)=>{
  const{Title,Description,Status,assignTo}=req.body
  const{userID,_id}=req.query   //Creator Id-->userID  TaskID====>_id

  const ifmoderatorExists=await taskmodel.findOne({userID})
  if(!ifmoderatorExists){
    res.status(400).json({message:"No access For This Action"})
  }

  const updateInfo=await taskmodel.findOneAndUpdate(
    {_id},
    {Title,Description,Status,assignTo},
    {new:true}
  )
  res.status(200).json({message:'Updated SuccessFully',updateInfo})
}
//========================================Delete Task==================================================
export const DeleteTask=async(req,res,next)=>{
  const{userID,_id}=req.body
  
  const ifmoderatorExists=taskmodel.findOne({userID})
  if(!ifmoderatorExists){
    res.status(400).json({message:'No Access For This Action'})
  }

  const DeleteTask=await taskmodel.findByIdAndDelete(
    {_id},
    {new:true}
  )
  res.status(200).json({message:'Task Deleted SuccessFully',DeleteTask})
}
//===============================Get all tasks with user data=======================================
export const GetallTasks=async(req,res,next)=>{
  const Tasks = await taskmodel.find()
   .populate({
    path: 'userID',
    select: 'Username Email '
   })
   .populate({
    path: 'assignTo',
    select: 'Username Email Phone'
   })
  res.json({message:'success',Tasks})
}
//================================get tasks of oneUser with user data==========================
export const GettingUserTasks=async(req,res,next)=>{
  const{userID}=req.query
  const user=await usermodel.findById(userID).select('Username Email Phone')

  if(!user){
    return res.status(404).json({message:'User Not Found'})
  }
 // Retrieve tasks for the specified user from the database
 const tasks = await taskmodel.find({ assignTo: userID });

 res.json({ message: 'Success', user, tasks })
}
//=================================Get all tasks that not done after deadline==========================
export const LateDeadlineTasks=async(req,res,next)=>{
  const currentdate =moment().format()
  const LateTasks=await taskmodel.find({
    deadline:{$lt:currentdate},
    Status:{$ne : "done"}
  })
  LateTasks.length ?res.status(200).json({message:"Late Tasks :",LateTasks}) : res.status(404).json({message:"No Tasks Found"})
}
