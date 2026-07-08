import { Request,Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/auth.types";

export const signup = async(req: Request,res:Response)=>{
    try{
        const{name,email,password} = req.body;
        //check existing user 
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message:"User already exists",
            });
        }
        //Hash pass
        const hashedPassword = await bcrypt.hash(password,10);
        
        // create user
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        });

        const { password: _, ...userWithoutPassword } = user.toObject();

            res.status(201).json({
         message: "User created successfully",
            user: userWithoutPassword,
            });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            message:"Internal server Error",
        });
    }
};

export const login = async(req:Request ,res: Response)=>{
    try{
        const{email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message :"Invalid credentials",
            });
        }
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({
            message :"Invalid credentials",
            });
        }

        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET as string,
            {
                expiresIn :"7d",
            }
        );
  const { password: _, ...userWithoutPassword } = user.toObject();

res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true after deployment (HTTPS)
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

res.status(200).json({
  message: "Login Successful",
  user: userWithoutPassword,
});
    }catch(error){
        console.error(error);

       return res.status(500).json({
            message:"Internal Server Error",
        });
    }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    res.status(200).json({
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};