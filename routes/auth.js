import express from 'express'
import {register,login, initiatePasswordRecovery, resetPassword} from '../controllers/authController.js'

const AuthRouter = express.Router();

AuthRouter.post('/register', register)
AuthRouter.post('/login', login)
AuthRouter.post('/password-recovery', initiatePasswordRecovery);
AuthRouter.post('/reset-password', resetPassword);


export default AuthRouter;