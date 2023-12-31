const Useroute =require('express').Router();
const bcrypt = require("bcrypt");

const session = require('express-session');
const passport = require("passport");
const User =require('../Model/UserLogin');
LocalStrategy = require('passport-local').Strategy;

const jwt = require('jsonwebtoken')
// passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  process.nextTick(function() {
  done(null, user._id);
});
});

passport.deserializeUser(function(id, done) {
    process.nextTick(function() {
          User.findById(id, function(err, user) {
            done(err, user);
            console.log("error"+err);
            console.log("user"+user);
          });
});
});
Useroute.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
Useroute.post('/post', async (req,res)=>{
          console.log("post require is working");
          try {
            // const {formData} = req.body;
            // console.log(formData)
            const plainPassword = req.body.password;
            const hashPassword = bcrypt.hashSync(plainPassword, 2);
                    const newdata= new User({
                            Fullname:req.body.FullName,
                            Email:req.body.Email,
                            PhoneNumber:req.body.PhoneNumber,
                            Password:hashPassword,
                            IsRider:req.body.IsRider
                    })
                    console.log(newdata);
                    const save= await newdata.save()
                    res.json("User is save")
                    
          } catch (error) {console.log(error);}
          
})
Useroute.post("/adminLogin",async function(req,res){
  try{
    const reqEmail = req.body.email;
        const reqPassword = req.body.password;
        console.log(reqEmail);
        const item = await User.findOne({email: reqEmail});
        console.log(item); //  email
        if(item === null){
            res.json("no")
        }else{
        const savePassword = item.Password;
        if(bcrypt.compareSync(reqPassword, savePassword) === true){
                res.status(200).json(reqEmail)
        }else if(bcrypt.compareSync(reqPassword, savePassword) === false){
            res.json("false");
        }
    }
} catch (error) {
    res.json(error)
    
}
})
// getting the all item present in cart
Useroute.get('/get',async(req,res)=>{
          console.log("getting the all item present in cart get requst is working");
          try {
                    const specificItem =await User.find({})
                    res.status(200).json(specificItem)
          } catch (error) {
                    res.json(error);
          }
})
// Getting the specific item with help of email
Useroute.get('/getemail/:email',async(req,res) =>{
  console.log("getting the email get rquest is working");
  const data =req.params.email;
  console.log(data);
    try {
      let query =await User.findOne({Email: data})
      res.json(query);
    }catch (error) {res.json(error);}
})
// Gettting the email and phone at same time
Useroute.get('/getboth/:email/:phone',async(req,res) =>{
  console.log("getting the email get rquest is working");
  const email =req.params.email;
  const phone =req.params.phone;
  
    let foundPhone = await findPhone(phone);
    let foundEmail = await findEmail(email);
   let ans = foundEmail || foundPhone;
  //(`FoundPhone ${foundPhone} \nFoundEmail:${foundEmail} ans ${ans}`
  //           )
   res.json(ans)
    

    
})
async function findPhone(phone){
  try {
    console.log(" iam call ed phone");
    
    let res= await User.findOne({PhoneNumber: phone})
    if(res!==null){
      return true
    }else{
      return false
    }
    
  } catch (error) {
    console.log(error);
  }
}
async function findEmail(email){
  try {
    let res= await User.findOne({Email: email})
    if(res!==null){
      return true
    }else{
      return false
    }
  } catch (error) {
    console.log(error);
  }
}
  

// Getting the specific item with help of phone
Useroute.get('/getphone/:phone',async(req,res) =>{
  console.log("getting the phone get rquest is working");
  const data =req.params.phone;
  console.log(data);
    try {
      let foundPhone = await findPhone(data);
      res.json(foundPhone)
    }catch (error) {res.json(error);}
})

// Delete Item
Useroute.delete('/data/:name', async (req,res)=>{
          console.log("Deteling  the paticular get item  rquest is working");
          console.log(req.params.name);
          
          try {
              const deleteItem = await User.findOneAndRemove(req.params.name);
              res.status(200).json('Item_deleted');
          } catch (error) {
              res.json(error)
          }
})
      
// Delte all
Useroute.delete('/cart/empty',async (req, res)=>{
          console.log("/cart/empty get rquest is working");
          try {
              const deleteAll = await User.deleteMany(); 
              res.status(200).json('Items deleted');       
          } catch (error) {
              res.json(error); 
          }
          })


module.exports = Useroute;