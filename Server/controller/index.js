const User = require('../model/userSchema');
const bcrypt = require('bcryptjs');
const e = require('express');

exports.homeRoute = (req,res) => {
    res.send(`Hello Shubham !!`);
};

exports.register = async (req,res) => {
    const { name , email , phone , work , password , cpassword } = req.body ;
    
    if( !name || !email || !phone || !work || !password || !cpassword ){
        return res.status(422).json({ error : `Please Filled the Above Field Properly !! `});
    }

    try{
        const userExist = await User.findOne({email:email});

        if(userExist){
            return res.status(422).json({ error : `Email is Already Exist `});
        }else if(password!=cpassword){
            return res.status(422).json({ error : `Password are Not Matching `});
        }

        const newUser = new User({name , email , phone , work , password , cpassword});

        const userRegisterd = await newUser.save();

        if(userRegisterd){
            res.status(201).json({ message : "User Registeration Successfully !!"});
        }
        else{
            res.status(500).json({ error : `"Failed to Registered User !!`});
        }
    }
    catch(error){
        console.log(error);
    }
};

exports.login =  async (req,res) => {
    try{      
        const { email , password } = req.body ;

        if(!email || !password){
           return res.status(400).json({ message : `Please Enter Email And Password !! `});
        }

        const userLogin = await User.findOne({ email:email });
        
        if(userLogin){
            const isMatch = await bcrypt.compare(password,userLogin.password);

            const token = await userLogin.generateAuthToken();

            res.cookie("jwttoken",token,{
                expires : new Date(Date.now() + 29892000000),
                httpOnly : true
            });

            if(!isMatch){
                res.status(400).json({error : `User Login Failed Invalid Credentials`});
            }
            else{
                res.status(200).json({message : `User Login Successfully !!`});
            }
        }
        else{
            res.status(400).json({error : `User Login Failed Invalid Credentials`});
        }        
    }
    catch(error){
        console.log(error);
    }
};

exports.about = (req,res) => {
    res.send(req.rootUser);
};

exports.contacts = (req,res) => {
    res.send(req.rootUser);
};

exports.addContact = async (req,res) => {
    try{
        const { name , email , number } = req.body ;
        if(!name || !number || !email){
            return res.status(400).json({
                message : `Enter Name and Number !! `
            });
        }

        const UserFind = await User.findOne({_id:req.userID});

        if(UserFind){

            await UserFind.addContacts(name,number,email);
            await UserFind.save();

            res.status(201).json({
                message : `Contact Save Successfully !!`
            });
        }
        else{
            res.status(400).json({
                message : `Unable to Save Contact !!`
            });
        }
    }
    catch(error){
        console.log(error);
    }
};

exports.editContact =  async (req,res) => {
    res.send(req.rootUser);
    const userID = req.userID;
    const {id} = req.params;    
    const data = await User.findById({contacts : { $elemMatch : { _id : id } }});
    console.log(data);
};

exports.deleteContact = async (req,res)=> {
    try{
        const UserID = req.rootUser.email ;
        const {id} = req.params ;
        const data = await User.updateOne({email:UserID},{$pull:{
            "contacts" : {
                _id : id
            }
        }
    });
    if(!data){
            res.status(404).send({message:`Cannot Delete User `});
    }
    else{
            res.status(200).send({message:`User Deleted Successfully`});
    }
    }
    catch(error){
        console.log(error);
    }
};

exports.logOut = (req,res) => {
    res.clearCookie('jwttoken',{ path : '/' });
    res.status(200).send(`User Logout Successfully !! `);
};