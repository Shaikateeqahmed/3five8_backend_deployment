const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = express.Router();


//At this Endpoint user can signup by giving a Name, Email, Password, Phone_NO.
User.post("/signup", (req, res) => {
    try {
        let { Name, Email, Password, Phone_NO } = req.body;

        //Checking For All Required Fills are Fields Or not.
        if (Name && Email && Password && Phone_NO) {

            //Cheching for is user already exist or not.
            const users = fs.readFileSync("./UserDB.json", { encoding: "utf8" }) || [];
            let parse = JSON.parse(users);
            let Is_User_Exist = false;
            parse.map((el) => {
                if (el.Email === Email) {
                    Is_User_Exist = true;
                }
            })

            //if User already exist then give them a message.
            if (Is_User_Exist === true) {
                res.status(409).json(`User With This Email ID Already Exist!`);
            } else {

                //if user is new then bcrypt the password for security purpose and then save in UserDB.json.
                bcrypt.hash(Password, 5, (err, hash) => {
                    if (err) {
                        console.log(err);
                    } else {

                        //saving the data in UserDB.json.
                        parse.push({ id: parse.length + 1, Name, Email, Password: hash, Phone_NO });
                        fs.writeFileSync("./UserDB.json", JSON.stringify(parse));
                        res.status(200).json(`Hi ${Name} Signup Successfully!`);
                    }
                })

            }
        } else {
            res.status(400).json(`Please FillsAll The Fields!`);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

})

//At this Endpoint user can Login by providing a Email and Password.
User.post("/login", (req, res) => {
    try {
        let { Email, Password } = req.body;

        //Checking For All Required Fills are Fields Or not.
        if (Email && Password) {

            //Cheching for is user already Signup or not.
            const users = fs.readFileSync("./UserDB.json", { encoding: "utf8" }) || [];
            let parse = JSON.parse(users);
            let Is_User_Exist = false;
            parse.map((el) => {
                 
                if (el.Email === Email) {
                    Is_User_Exist = true;

                    //If user exist then checking for Password is correct or not by the help of bcrypt.
                    bcrypt.compare(Password, el.Password, (err, result) => {
                        if (err) {
                            res.status(400).json(`Please Check Your Password!`);
                        } else {

                            //If user exist and Password is correct then give then a token for Authentication Purpose.
                            let token = jwt.sign({ UserID: el.id }, process.env.key);
                            res.status(200).json(token);
                        }
                    })
                }
            })

            if (Is_User_Exist === false) {
                res.status(404).json(`Please Signup First!`);
            }
        } else {
            res.status(400).json(`Please Fill All The Fields!`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = { User };