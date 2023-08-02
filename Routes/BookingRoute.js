const express = require("express");
const Book = express.Router();
const fs = require("fs");

Book.get("/getname",(req,res)=>{
    let UserID = req.body.UserID;
    let users = fs.readFileSync("./UserDB.json",{encoding:"utf8"});
    let parse = JSON.parse(users);
    let UserByID = parse.filter((el)=>{
        if(el.id==UserID){
            return el;
        }
    })
    res.json(UserByID);
})

//User can get the information of all the Booking made by them.
Book.get("/", (req, res) => {
    try {
        let UserID = req.body.UserID;
        let bookings = fs.readFileSync("./Booking.json", { encoding: "utf8" }) || [];
        let parse = JSON.parse(bookings);

        //Getting the Booking of a particular user by the help of UserID.
        let booking_of_Particular_user = parse.filter((el) => {
            if (UserID === el.UserID) {
                return el;
            }
        })
        res.status(200).json(booking_of_Particular_user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//User can Book a Clubhouse or Tennis Court at this Endpoint.
Book.post("/", (req, res) => {
    try {
        let { Type, Date, StartTime, EndTime } = req.body;

        //Checking for All the require fields are fill or not.
        if (Type && Date && StartTime && EndTime) {
            let Slots = fs.readFileSync("./Booking.json", { encoding: "utf8" }) || [];
            let parse = JSON.parse(Slots);
            let Is_Slot_Available = true;

            //Checking for is slot is available or not.
            parse.map((el) => {

                //Checking for slot is available for the particular facility.
                if (el.Type === Type) {

                    //Checking for slot is available for the particular Date.
                    if (el.Date === Date) {

                        //Checking for slot is available for the particular Time.
                        if((StartTime==10||StartTime==11||StartTime==12) && (el.StartTime==10 ||el.StartTime==11||el.StartTime==12)){
                            if ((el.StartTime <= StartTime && StartTime < (el.EndTime+el.StartTime)) || (el.StartTime < EndTime && EndTime <= (el.EndTime+el.StartTime))) {
                                Is_Slot_Available = false;
                            }
                        }else{
                            if ((el.StartTime <= StartTime && StartTime < el.EndTime) || (el.StartTime < EndTime && EndTime <= el.EndTime)) {
                                Is_Slot_Available = false;
                            }
                        }
                       
                    }
                }
            })
 

            //Calculation of a Amount if slot is available.
            if (Is_Slot_Available) {
                let amount = 0;
                if (StartTime>=4 && StartTime!=10 && StartTime!=11 && StartTime!=12 && Type === "Clubhouse") {
                    amount = (EndTime - StartTime) * 500;
                } else if (EndTime < StartTime && Type === "Clubhouse" && EndTime < 4) {
                    amount = ((12 - StartTime) + EndTime) * 100;
                }else if((StartTime<4 || StartTime==10 || StartTime==11 || StartTime==12) && EndTime>4 && Type === "Clubhouse"){
                    if(StartTime<=12 && StartTime>=10){
                        amount = (12-StartTime+4)*100+ (EndTime - 4)*500;
                    }else{
                        amount = (4-StartTime)*100+ (EndTime-4)*500;
                    }
                }else if (EndTime > StartTime && Type === "Tennis Court") {
                    amount = (EndTime - StartTime) * 50;
                } else if (Type === "Tennis Court") {
                    amount = ((12 - StartTime) + EndTime) * 50;
                }else if(EndTime>StartTime && Type==="Clubhouse"){
                    amount = (StartTime-EndTime)*100;
                }

                //Saving the information in Booking.json.
                parse.push({ id: parse[parse.length-1].id+1, Type, Date, StartTime, EndTime, Amount: amount, UserID: req.body.UserID });
                fs.writeFileSync("./Booking.json", JSON.stringify(parse));
                res.status(200).json(`Booked, Rs.${amount}`);
            } else {
                res.status(409).json(`Booking Failed, Already Booked`);
            }
        } else {
            res.status(400).json(`Please Fill all the fields!`)
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

Book.delete("/:id", (req, res) => {
    try {
        let bookingid = req.params.id;
        let booking = fs.readFileSync("./Booking.json", "utf-8");
        let parse = JSON.parse(booking);
        let UserID = req.body.UserID;
        //Checking for User is having booking or not.
        let UserID_in_booking = parse.filter((el) => {
            if (bookingid == el.id) {
                return el;
            }
        })
        console.log(UserID_in_booking,typeof UserID,UserID);

        //Checking for Booking with the specific ID exist or not.
        if (UserID_in_booking.length > 0) {

            //Checking for user is Authorised to Delete the booking or not.
            if (UserID_in_booking[0].UserID == UserID) {
                let newbooking = parse.filter((el) => {
                    if (el.id != bookingid) {
                        return el;
                    }
                })

                //Saving the new Booking list.
                fs.writeFileSync("./Booking.json", JSON.stringify(newbooking));
                res.status(200).json(`Booking Having Id:- ${bookingid} is deleted successfully!`);
            } else {
                res.status(401).json(`You are not Authorised to Delete the Booking!`);
            }
        } else {
            res.status(409).json(`Booking with the ID:- ${bookingid} is not exist!`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }



})

module.exports = { Book };