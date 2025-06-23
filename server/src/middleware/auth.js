import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";


export const protectRoute = asyncHandler( async(req,res,next)=>{
    
        
    const token = req.headers.token;

    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId).select("-password")

    if(!user){
        throw new ApiError(404, "User not found")
    }

    req.user = user

    next()

    
})