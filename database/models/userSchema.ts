import { unique } from "next/dist/build/utils";
import mongoose, { Document, Schema } from 'mongoose';

// Interface for the User model
export interface IUser extends Document {
  name: String;
  email: String;
  password:String
}
const userSchema:Schema<IUser>= new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true});
// const User =  mongoose.model<IUser>('User', userSchema);
// mongoose.models.User ||
const User = mongoose.models ?.User || mongoose.model<IUser>('User', userSchema);
export default User;
