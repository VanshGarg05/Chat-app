import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import bcryptjs from "bcryptjs"
import { generateToken } from "../utils/token.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import cloudinary from "../utils/cloudinary.js"


const signup = asyncHandler(async(req,res)=>{
    const {fullName, email, password, bio} = req.body
    if(!fullName || !email || !password || !bio){
        throw new ApiError(403,"Details are missing")
    }

    const user = await User.findOne({email})

    if(user){
        throw new ApiError(403,"User already exists")
    }

    const hashedPass = bcryptjs.hashSync(password,10)

    const newUser = await User.create({
        fullName,
        email,
        password:hashedPass,
        bio
    })

    const token = generateToken(newUser._id)

    return res
    .status(200)
    .json(new ApiResponse(200,{newUser,token},"Account created Successfully"))

})



const login = asyncHandler(async(req,res)=>{
    const {email,password} = req.body

    const userData = await User.findOne({email})

    const isPasswordCorect = await bcryptjs.compare(password, userData.password)

    if(!isPasswordCorect){
        throw new ApiError(403,"Invalid credentials")
    }

    const token = generateToken(userData._id)

    return res
    .status(200)
    .json(new ApiResponse(200,{userData,token},"Login Successfully"))

})



const checkAuth = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(200,req.user,"User is authenticated"))
})


const updateProfile = asyncHandler(async(req,res)=>{
    const {profilePic, bio, fullName} = req.body

    const userId = req.user._id

    let updatedUser

    if(!profilePic){
        updatedUser = await User.findByIdAndUpdate(userId,{bio,fullName},{new:true})
    }else{
        const upload = await cloudinary.uploader.upload(profilePic)

        updatedUser = await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true})

        return res
        .status(200)
        .json(new ApiResponse(200,updatedUser,"Profile updated successfully"))
    }



})


 
export {
    signup,
    login,
    checkAuth,
    updateProfile
}