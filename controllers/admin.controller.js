import User from '../models/user.model.js';
import Admin from "../models/admin.model.js";
import Listing from '../models/listing.model.js';
import bcryptjs from 'bcryptjs';

export const adminSignUp = async (req, res, next) => {
 const { email, password, avatar } = req.body;
 const hashedPassword = bcryptjs.hashSync(password, 10);
 const admin = new Admin({email, password : hashedPassword, avatar});
 try{
    await admin.save();
    res.status(201).json("Admin Created Successfully")
 }catch(error){
    next(error)
 }

}

export const adminSignIn = async (req, res, next) => {
    const { email, password } = req.body;
    
    try{
        const ValidAdmin = await Admin.findOne({ email })
        if(!ValidAdmin) return next({ statusCode : 404, message : "Admin Not Found"})
        const ValidPassword = bcryptjs.compareSync(password, ValidAdmin.password)
        if(!ValidPassword) return next({ statusCode : 401, message : "Invalid Credentials"})

        const {password : pass, ...rest} = ValidAdmin._doc;

        res.status(200).json(rest)
    }catch(err){
        next(err)
    }

}
export const getUsers = async (req, res, next) => {
    try{
        const users = await User.find({})
        res.json(users)
    }catch(error){
        next({
            statusCode : 201,
            message : "No Users Found"
        })
    }
}

export const getListings = async (req, res, next) => {
  try{
    const listings = await Listing.find({}).populate('userRef').exec();
    if(!listings || listings == []){
        next(errorHandler(404, "Not Found"))
    }

    res.status(200).json(listings)
  }catch(err){
    next(err)
  }

}

export const getAdmin = async (req, res, next) => {
    try {
      
      const admin = await Admin.findById(req.params.id);
    
      if (!admin) return next(errorHandler(404, 'Admin not found!'));
    
      const { password: pass, ...rest } = admin._doc;
    
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };