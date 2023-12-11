import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true 
    },
    // oauthID: {
    //     type: String,
    //     required: true
    // },
    phone: {
        type: String,
        required: true
    },
    securityquestion1: {
        type: String,
        required: true
    },
    securityquestion2: {
        type: String, 
        required: true
    },
    twoFactorSecret: {
        type: String,
        required: true
    },
    itineraryIds: [
        {
        type: mongoose.Types.ObjectId,
        ref: 'Itinerary'
        }
    ],

    reviewIds: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Reviews'
        }
    ],

    passwordResetToken: {
        type: String
    },

    passwordResetTokenExpiry: {
        type: String
    }
}
);

export default mongoose.model("User",UserSchema);