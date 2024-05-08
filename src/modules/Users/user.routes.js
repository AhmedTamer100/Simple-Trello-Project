import {Router} from 'express'
const router=Router()
import * as uc from './user.controller.js'
import { asyncHandler } from '../../utils/errorhandling.js'
import { isAuth } from '../../middlewares/auth.js'

router.post('/signup',uc.SignUp)
router.post('/login',asyncHandler((uc.Login)))
router.patch('/updatePass',isAuth(),asyncHandler((uc.ChangePassword)))
router.patch('/updateInfo',isAuth(),asyncHandler((uc.UpdateInfo)))
router.delete('/DeleteUser',isAuth(),asyncHandler((uc.DeleteUser)))
router.patch('/SoftDelete',isAuth(),asyncHandler((uc.SoftDelete)))
router.patch('/Logout',isAuth(),asyncHandler((uc.LogOut)))
export default router