import mongoose from "mongoose"

const connectDB = async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
        console.log("MONGO DB Connected!!!");
    } catch (error) {
        console.log(error.message);
    }
}

export default connectDB