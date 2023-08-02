const chai = require("chai");
const { server }= require("../index.js");
const chaiHTTP = require("chai-http");

//assertion style
chai.should();

chai.use(chaiHTTP);

describe("Testing APIs",()=>{
    // test cases

    //Testing POST Route of Signup.
    describe("POST /user/signup",()=>{
        it("Should POST the Details of a user ",(done)=>{
            
               let Name = "s";
               let Email = "s@gmail.com";
               let Password = "shaik";
               let Phone_NO = "554865"
            
            chai.request(server)
            .post("/user/signup")
            .send({Name,Email,Password,Phone_NO})
            .end((err,response)=>{
                response.should.have.status(200) 
                response.body.should.be.a("string")
                done()
            })
        })
    })

    describe("POST /user/signup",()=>{
        it("Should show a 409 error if user already signup",(done)=>{
            
               let Name = "s";
               let Email = "s@gmail.com";
               let Password = "shaik";
               let Phone_NO = "554865"
            
            chai.request(server)
            .post("/user/signup")
            .send({Name,Email,Password,Phone_NO})
            .end((err,response)=>{
                response.should.have.status(409) 
                response.body.should.be.a("string");
                done()
            })
        })
    })

    describe("POST /user/signup",()=>{
        it("Should show a 400 error if user not fields all the fills",(done)=>{
            
               let Email = "s@gmail.com";
               let Password = "shaik";
               let Phone_NO = "554865"
            
            chai.request(server)
            .post("/user/signup")
            .send({Email,Password,Phone_NO})
            .end((err,response)=>{
                response.should.have.status(400) 
                response.body.should.be.a("string");
                done()
            })
        })
    })

//////////////////////////////////////////////////////////////
     

   //Testing POST Route of Login.
   describe("POST /user/login",()=>{
    it("Should Login the user ",(done)=>{
        
           let Email = "s@gmail.com";
           let Password = "shaik";
        
        chai.request(server)
        .post("/user/login")
        .send({Email,Password})
        .end((err,response)=>{
            response.should.have.status(200) 
            response.body.should.be.a("string")
            done()
        })
    })
})

describe("POST /user/login",()=>{
    it("Should show a 404 error if user not already signup",(done)=>{
        
           let Email = "Z@gmail.com";
           let Password = "shaik";
        
        chai.request(server)
        .post("/user/login")
        .send({Email,Password})
        .end((err,response)=>{
            response.should.have.status(404) 
            response.body.should.be.a("string");
            done()
        })
    })
})

describe("POST /user/login",()=>{
    it("Should show a 400 error if user not fills all the fields or password is incorrect",(done)=>{
        
           let Email = "s@gmail.com";
           let password = "s";
        
        chai.request(server)
        .post("/user/login")
        .send({Email,password})
        .end((err,response)=>{
            response.should.have.status(400) 
            response.body.should.be.a("string");
            done()
        })
    })
})
//////////////////////////////////////////////////////////////

   //Testing POST Route of Book.
   describe("POST /book",()=>{
    it("Should POST the Details of a Booking ",(done)=>{
        
           let Type = "Clubhouse";
           let Date = "2023-08-04";
           let StartTime = 10;
           let EndTime = 4
        
        chai.request(server)
        .post("/book")
        .send({Type,Date,StartTime,EndTime})
        .end((err,response)=>{
            response.should.have.status(200) 
            response.body.should.be.a("string")
            done()
        })
    })
})

 //Testing POST Route of Book.
 describe("POST /book",()=>{
    it("Should get 400 error if user not fills all the fields ",(done)=>{
        
           let StartTime = 10;
           let EndTime = 4
        
        chai.request(server)
        .post("/book")
        .send({StartTime,EndTime})
        .end((err,response)=>{
            response.should.have.status(400) 
            response.body.should.be.a("string")
            done()
        })
    })
})

describe("POST /book",()=>{
    it("Should show 409 error if slot is not available for the paritcular time",(done)=>{
        
        let Type = "Clubhouse";
        let Date = "2023-08-04";
        let StartTime = 10;
        let EndTime = 4
        
        chai.request(server)
        .post("/book")
        .send({Type,Date,StartTime,EndTime})
        .end((err,response)=>{
            response.should.have.status(409) 
            response.body.should.be.a("string");
            done()
        })
    })
})

//////////////////////////////////////////////////////////////////////

   //Testing GET Route of book.
   describe("GET /book",()=>{
    it("Should Get the list of a bookings",(done)=>{
        
        chai.request(server)
        .get("/book")
        .end((err,response)=>{
            response.should.have.status(200) 
            response.body.should.be.a("array")
            done()
        })
    })
})

///////////////////////////////////////////////////////////////////////////

    //Testing Delete Route of book.
    describe("DELETE /book",()=>{
        it("Should delete the booking by it id",(done)=>{
            
               const id = 2;
            
            chai.request(server)
            .delete(`/book/${id}`)
            .end((err,response)=>{
                response.should.have.status(200) 
                response.body.should.be.a("string")
                done()
            })
        })
    })
})