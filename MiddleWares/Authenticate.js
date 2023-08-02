const jwt = require("jsonwebtoken");
require("dotenv").config();


const authenticate = (req,res,next)=>{
    let token = req.headers.authorization;

    //checking for is user login or not
    if(token){

        // verifing a token.
        jwt.verify(token,process.env.key,(err,decode)=>{
            if(err){
                res.status(400).json(`Please Login again, token expired!`);
            }else{
                let UserID = decode.UserID;
                req.body.UserID = UserID;
                next();
            }
        });
    }else{
        res.status(409).json("PLease Login First!")
    }
}

module.exports={authenticate};