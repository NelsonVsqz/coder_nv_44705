
const User = require("../dao/models/user");

const userChange = async (req, res) => {

    const userCurrent = req.user
    const user = await User.findOne({ email: userCurrent.email }); 
    console.log(userCurrent)
    console.log(user)       
    if(user.role == "usuario"){
     user.role = "premium"
     user.save()
     res.status(200).json({message:"Success change to premium"});
     console.log("Change1")
     console.log(user)            
    } else if(user.role == "premium"){
    user.role = "usuario"
    user.save()
    res.status(200).json({message:"Success change to usuario"});
    console.log("Change2")
    console.log(user)                
    } else{
  
    res.status(200).json({message:"You are admin not change"});
    }
};
  
module.exports = { userChange };