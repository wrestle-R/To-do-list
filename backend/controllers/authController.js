const User = require('../models/user')
const {hashPassword, comparePasswords} = require('../helpers/auth')
const currentDateTime = new Date();
const jwt = require('jsonwebtoken')


const test = (req,res) => {
    res.json("test is working")
}

const registerUser = async (req, res)=>{
    try{
        const {fullName, email, password} = req.body
        // Check if name was entered
        if(!fullName){
            return res.json({
                error: "Name is a mandatory field   "
            })
        }
        // Check if password was entered
        if(!password || password.length < 6){
            return res.json({
                error: "Password is a Mandatory field and has to be more 6 charachters long "
            })
        }
        // Check if email was enteredx
        const exist = await User.findOne({email})
        if(exist){
            return res.json({
                error: 'The email is already taken'
            })
        }

        const hashedPassword = await hashPassword(password)

        function formatName(fullName) {
            if (!fullName) return "";
            const firstName = fullName.trim().split(" ")[0];
            return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
          }
        
        //create user in the database
        const user = await User.create({
            fullName,
            nickname : formatName(fullName),
            email,
            password : hashedPassword,
            time_created_at : currentDateTime,

        })

        return res.json(user)
    } catch (error) {
        console.log(error)
    }
}

const loginUser = async (req,res) =>{
    try{
        const {email,password} = req.body

        //check if user exists
        const user = await User.findOne({email})
        if(!user){
            return res.json({
                error: 'The User doesnt exist'

            })
        }

        //Check if password exists
        const match = await comparePasswords(password,user.password)
        if(match){
            jwt.sign({email: user.email, id: user._id, fullName: user.fullName, nickname: user.nickname,},process.env.JWT_SECRET,{},(err, token)=>{
                if(err)
                    throw err
                res.cookie('token', token).json(user)
                
            })
        }
        if(!match){
            res.json({
                error: 'Passwords do not Matchh'
            })
            
        }
    }catch(error){
        console.log(error)
    }
}



const getProfile = (req, res) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid Token' });
      }
      res.json(user);
    });
  };


module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile
}