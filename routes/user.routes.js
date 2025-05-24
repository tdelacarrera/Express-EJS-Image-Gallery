import express from 'express';
import {methods as authorization} from "../middlewares/authorization.js";  
import {methods as userController} from "../controllers/user.controller.js";  
const router = express.Router();

router.get('/users', authorization.checkIsAdmin,userController.getUsers);
router.post('/users/create', authorization.checkIsAdmin, userController.createUser);
router.post('/users/update', authorization.checkIsAdmin, userController.updateUser);
router.post('/users/remove', authorization.checkIsAdmin, userController.removeUser);
router.post('/users/register',userController.registerUser);
router.get('/users/register',userController.getRegisterForm);
router.get('/users/login',userController.getLoginForm);
router.post('/users/login',userController.login);
router.get('/users/logout',userController.logout);

export default router;