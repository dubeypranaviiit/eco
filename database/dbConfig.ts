import mongoose from "mongoose";
const MONGODB_URL: string = process.env.MONGODB_URL!;
const dbConnect = async () => {
     mongoose.connect(MONGODB_URL)
    .then(()=>{
        console.log(`Database connected successfully`);
    })
    .catch((error)=>{
        console.log(`Error while connecting db`);
        console.log(error);
        process.exit(1)
    })
};

export default dbConnect;