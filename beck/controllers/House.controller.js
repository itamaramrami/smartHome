import {User} from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import {generateTokenAndSetcookie} from "../utils/generateTokenAndSetcookie.js";
import {sendResetSuccessEmail, sendVerificationEmail} from "../mailtrap/emails.js";
import {sendwelcomeEmail} from "../mailtrap/emails.js";
import { sendPasswordResetEmail } from "../mailtrap/emails.js";



export const signup = async(req, res) => {
    const { name, email, password } = req.body
    try{
       if(!name || !email || !password){
        throw new Error("All fields are required")
    }
    const userAlreadyExist = await User.findOne({email})
    if(userAlreadyExist){
        return res.status(400).json({success:false, message: "User already exist"})
    }
    const hashedPassword = await bcryptjs.hash(password, 10)
    const verificationtoken =Math.floor(100000 + Math.random() * 900000).toString()
    const user= new User({
        email,
        password: hashedPassword,
        name,
        verificationtoken,
        verificaTiontokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
    })
    await user.save()
    generateTokenAndSetcookie(res,user._id)
    await sendVerificationEmail(user.email, verificationtoken)



    res.status(201).json({
        success:true,
        message: "User created successfully",
        user: {
           ...user._doc,
           password: undefined
        },
    })
}
catch(error){
   res.status(400).json({success:false, message: error.message})
}}


export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
		verificationtoken: code
		
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
            
		}
		user.isverified = true;
		user.verificationtoken = undefined;
		user.verificaTiontokenExpiresAt = undefined;
        await user.save();


		await sendwelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};


export const login = async(req, res) => {
    const { email, password } = req.body
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success:false, message: "Invalid credentials"})
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({success:false, message: "Invalid credentials"})
        }
        generateTokenAndSetcookie(res,user._id)
        user.lastlogin = new Date()
        await user.save()
        res.status(200).json({
            success:true,
            message: "logged in successfully",
            user: {
               ...user._doc,
               password: undefined
            },
        })
        
    }catch(error){
        console.log("error in login ", error)
        res.status(400).json({success:false, message: error.message})
}
}


export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};
 
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const resetToken = crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt = Date.now() + 1 * 60 *60* 1000; 
      user.resetpasswordtoken = resetToken;
      user.resetpasswordexpire = resetTokenExpiresAt;
      await user.save();
      await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
      res.status(200).json({ success: true, message: "Password reset email sent" });
    } catch (error) {
       console.log("error in forgotPassword ", error);
       res.status(400).json({ success: false, message: error.message });
}}

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetpasswordtoken: token,
			resetpasswordexpire: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetpasswordtoken = undefined;
		user.resetpasswordexpire = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};
