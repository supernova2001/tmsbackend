import express from 'express'
import {createUser} from '../controllers/userController.js';

const CreateUserRouter = express.Router();

CreateUserRouter.post('/',createUser);



export default CreateUserRouter;
