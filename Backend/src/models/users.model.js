import mongoose from "mongoose"

const usersSchema= new mongoose.Schema({
   username : {
   type: String,
   unique: true,
   require: true
   },

   email: {
    type: String,
    unique: true,
    require: true
   },
   
   password: {
    type: String,
    require:true
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
