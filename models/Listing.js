const mongoose = require("mongoose"); // import mongoose dependencie

const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isFree: {
        type: String,
        enum: ["free", "trade"]
    },
    description: String,
    type: {
        type: String,
        enum: ["available", "desired"]
    },
    category : {
        type: String,
        enum: ["online services", "learning services", "grocery pickup", "items", "expertise", "other"]
    },
    date: {
        type : Date,
        default: Date.now
    },
    active: {
        type : Boolean,
        default: true
    }
})

const listingModel = mongoose.model("Listing", listingSchema);

module.exports = listingModel;




