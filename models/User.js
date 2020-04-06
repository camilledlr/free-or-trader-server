const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    username: String,
    name: String,
    lastName: String,

    email: {
        type: String,
        unique: true,
        validate: {
            validator: function(v) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            }
        }
    },

    avatar: {
        type: String,
        default : 'https://www.bitgab.com/uploads/profile/files/default.png'
    },
    listings: [{
        type: Schema.Types.ObjectId,
        ref: "Listing"
    }],
    password: String,
    rates: {
    type : [Number],
    default : [0]},
    description: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    account_creation : {
        type : Date,
        default: Date.now
    },
    address: {
        street: String,
        zipCode: Number,
        city: String
    },
    location : {
        type: { type: String },
        coordinates: [Number]
    }
})

userSchema.index({location: '2dsphere'});
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;