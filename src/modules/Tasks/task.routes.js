import {Router} from 'express'
const router=Router()
import * as tc from './task.controller.js'
import { isAuth } from '../../middlewares/auth.js'
import { asyncHandler } from '../../utils/errorhandling.js'


router.post('/AddTask',isAuth(),asyncHandler((tc.AddTask)))
router.patch('/UpdateTask',isAuth(),asyncHandler((tc.UpdateTask)))
router.delete('/DeleteTask',isAuth(),asyncHandler((tc.DeleteTask)))
router.get('/Getalltasks',isAuth(),asyncHandler((tc.GetallTasks)))
router.get('/GettingUserTasks',isAuth(),asyncHandler((tc.GettingUserTasks)))
router.get('/GetLateTasks',isAuth(),asyncHandler((tc.LateDeadlineTasks)))
export default router