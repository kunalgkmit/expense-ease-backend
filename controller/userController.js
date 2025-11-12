import {User, Role} from "../db/dbconnection.js";
import bcryptjs from "bcryptjs";

export const registerController=async(req, res)=>{
    // return res.json("hello");
    console.log(req.body)

    const {name, email, password}=req.body;
    const existUser = await User.findOne({where:{email}});
    if(existUser!=null){
        return res.status(409).json("User is already exist");
    }else{
        const hashedPass = await bcryptjs.hash(password,10);
        const user = await User.create({
            ...req.body,
            password:hashedPass
        });
        return res.status(201).json(user);
    }
};

export const loginController=async(req, res)=>{
    // const { password, email}=req.body;
    try {
        const { password, email}=req.body;
        const exist = await User.findOne({where:{email:email}});
        if(exist != null){
            const isValid = await bcryptjs.compare(password, exist.password);
            if(!isValid){
                return res.status(401).json("Credential invalid");
            }
            return res.send("Login success");
        }
    } catch (error) {
        console.log("Internal error");
        res.status(500).json("Internal error");
    }
}