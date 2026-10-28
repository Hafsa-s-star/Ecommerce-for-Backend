import mongoose from "mongoose"

const usersSchema= new mongoose.Schema({
   username : {
   type: String,
   unique: true,
   required: true
   },

   email: {
    type: String,
    unique: true,
    required: true
   },

   googleId: {
    type: String,
    unique: true,
    sparse: true
   },
   
   password: {
    type: String,
    required:true
   },

   role:{
      type: String,
      default: "user",
      enum:["user","admin"]
   },

   cart:[{
      product:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required:true
      },
      quantity:{
         type: Number,
         required:true,
         min:1,
         default:1
      }
   }]
}, { timestamps: true })
const usersModel = mongoose.model("users",usersSchema)
export default usersModel
