import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from "mongoose"

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }

  // if (req.user.id !== listing.userRef) {
  //   return next(errorHandler(401, 'You can only delete your own listings!'));
  // }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
 

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById({_id: req.params.id}).populate("comments.postedBy", "username avatar");
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;  

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex)
      .exec();

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const likeListing = async (req, res, next) => {
  try{
    const session = await mongoose.startSession();
    session.startTransaction()
    const likedListing = await Listing.findByIdAndUpdate(req.body.listingId, {
      $addToSet : {likedBy : req.body.userId}
    }, {new : true})
    const updatedUser = await User.findByIdAndUpdate(req.body.userId, {
      $addToSet : {likedListings : req.body.listingId}
    },{new : true})
    session.commitTransaction()


    return res.json({likedListing, updatedUser})

  }catch(err){
    next(err)
  }
}

export const unLikeListing = async (req, res, next) => {
  try{
    const session = await mongoose.startSession();
    session.startTransaction()
    const unLikedListing = await Listing.findByIdAndUpdate(req.body.listingId, {
      $pull : {likedBy : req.body.userId}
    }, {new : true})
    const updatedUser = await User.findByIdAndUpdate(req.body.userId, {
      $pull : {likedListings : req.body.listingId}
    },{new : true})
    session.commitTransaction()

    return res.json({unLikedListing, updatedUser})

  }catch(err){
    next(err)
  }
}

export const addComment = async (req, res, next) => {
  const {userId, listingId, comment} = req.body
  // console.log(`userId : ${userId}, postId : ${postId} , comment : ${comment}`)

  try {
    const listing = await Listing.findOneAndUpdate({_id : listingId}, {
      $push : {comments : {text : comment , postedBy : userId}}
    }, {new : true}).populate("comments.postedBy" , "username avatar")

    return res.json(listing)
  } catch (error) {
    console.log(error)
  }
}

export const removeComment = async (req, res, next) => {
  const {listingId, commentId} = req.body
  try {
    const listing = await Listing.findOneAndUpdate({_id : listingId}, {
      $pull : {comments : {_id : commentId}}
    }, {new : true}).populate("comments.postedBy" , "username avatar")

    return res.json(listing)
  } catch (error) {
    console.log(error)
  }

}
