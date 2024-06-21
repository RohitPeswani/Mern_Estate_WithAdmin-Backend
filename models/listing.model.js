import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    furnished: {
      type: Boolean,
      required: true,
    },
    parking: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    offer: {
      type: Boolean,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: mongoose.Types.ObjectId,
      refPath: 'userType'
    },
    userType: {
      type: String,
      enum: ['User', 'Admin'], // Enum to specify the possible types
      required: true,
    },
    alreadyBooked : {
      type : Boolean,
      default : false
    },
    likedBy : [{type : mongoose.Types.ObjectId, ref : 'User'}],
    comments : [
      {
        text : {type : String},
        createdAt : {type : Date, default : Date.now},
        postedBy : {type : mongoose.Types.ObjectId, ref : 'User'}
      }
    ]
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
