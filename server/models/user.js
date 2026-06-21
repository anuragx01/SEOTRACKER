import mongoose from "mongoose";
import { useDeferredValue } from "react";

const userSchema = new mongoose.Schema({
    name: {type: String , required: true , trim: true},
    email: {type: String , required: true , unique: true , lowercase: true , trim: true},
    password: {type:String , required: true },
    plan: {type: string , enum : ["free" , "pro"] , default : "free"},
    analysisCount: {type:Number , default : 0},
    lastAnalysisDate: {type: Date , default: null},
}, {timestamps: true})

const User = mongoose.model("User" , userSchema) 

export default User;