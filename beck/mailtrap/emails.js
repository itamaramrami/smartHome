import {VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE} from "./ameilsTemplates.js";
import {mailtrapclient, sender} from "./mailtrap.js";



export const sendVerificationEmail= async(email,verificationtoken)=>{
    const recipient=[{email}]
    try{
       const response = await mailtrapclient.send({
        from:sender,
        to:recipient,
        subject:"Verify your email",
        html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationtoken),
        category:"email verification"
       }) 
       console.log('Email sent successfully',response)
    }
    catch(error){
        console.log('Error sending verification email',error)
        throw new Error('Error sending verification email:${error}')
    }
}


export const sendwelcomeEmail= async(email,name)=>{
    const recipient=[{email}]
    try{
       const response = await mailtrapclient.send({
        from:sender,
        to:recipient,
       template_uuid:"84737ee9-24e1-412f-a2f2-ce406e0f995e",
       template_variables: {
        "company_info_name": "House company",
        "name": name,
      }
       })
       console.log('Email sent successfully',response)
    }
    catch(error){
        
    }
}


export const sendPasswordResetEmail = async (email,resetURL) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapclient.send({
            from: sender,
            to: recipient,
            subject: "reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "password reset"
        })
    } catch (error) {
        console.error('Error sending password reset email', error)
       throw new Error(`Error sending password reset email:${error}`)
    }
}

export const sendResetSuccessEmail= async(email)=>{
    const recipient=[{email}]
    try{
       const response = await mailtrapclient.send({
        from:sender,
        to:recipient,
        subject:"Password reset successful",
        html:PASSWORD_RESET_SUCCESS_TEMPLATE,
        category:"Password reset"
       }) 
       console.log('Password rest email sent successful ',response)
    }
    catch(error){
       console.error('Error sending password reset email',error)
       throw new Error(`Error sending password reset email:${error}`)
    }
}