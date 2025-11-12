import {Router} from 'express';
import { loginController, registerController } from '../controller/userController.js';



const router = Router();


// router.get("/",(req,res)=>{
//     return res.json("hello hello");
// });

router.post("/register", registerController);
router.post("/login", loginController);



export default router;