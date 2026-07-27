import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError, success } from "zod";

const validate =
  (schema:ZodSchema) =>
  (req:Request,res:Response,next:NextFunction):void=>{
    try{
        schema.parse(req.body);
        next();
    }catch(error){
        if(error instanceof ZodError){
            res.status(400).json({
                success:false,
                message:"Validation Failed.",
                error:error.issues,
            });
            return;
        }
        next(error);
    }
  };

  export default validate;