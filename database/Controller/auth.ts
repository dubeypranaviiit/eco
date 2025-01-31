import { NextApiRequest, NextApiResponse } from "next";

async function signUp(email:string,name:string,password:string,confirmPassword:string,req: NextApiRequest, res: NextApiResponse){
    try{
        const { email, password, confirmPassword } = req.body;
        if(!email || !password || !confirmPassword){
            return res.status(400).json({
                success:false,
                message:`Something went wrong,please try again later`
            })
        }
    }catch(error){
        return res.status(500).json({
            success:false,
            message:`Something went wrong,please try again later`
        })
    }
}