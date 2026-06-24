import mongoose from "mongoose" ;
import { useId } from "react";

const rankEntrySchema = new mongoose.Schema({
    date: {type: Date , required: true},
    position: {type : Number , default: null},
    page : {type: Number , default: null},
    title: {type: String , default : ""},
    snippet : {type: string , default: ""},
}, {_id: false})


const competitorSchema = new mongoose.Schema({
    date : {type:Number , required: true},
    url : {type:string , required: true},
    domain: {type:string , required: true},
    title: { type : string , default: ""},
    snippet: {type: string , default: ""},
} , {_id: false})

const keywordTrackingSchema = new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true},
    keyword : {type: String , required: true , trim: true , lowercase: true},
    url: {type: String , required: true , trim : true},
    domain : {type: String , required: true},
    currentPosition : {type: Number , default: null},
    currentPage : {type: Number , default : null},
    bestPosition : {type : Number, default : null},
    positionChange : {type: Number , default : 0},
    rankHistory : [rankEntrySchema],
    competitors: [competitorSchema],
    active: {type: Boolean , default: true},
    lastChecked : { type: date , default : null},
    status: {type: String , enum:["pending" , "checking" , "completed" , "failed"], default: "pending" },
} , {timestamps: true})

keywordTrackingSchema.index({useId: 1, keyword: 1, domain: 1}, {unique: true})

const KeywordTracking = mongoose.model("KeywordTracking" , keywordTrackingSchema)

export default KeywordTracking;