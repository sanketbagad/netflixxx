import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String,
    },
    hasPaid: {
        type: Boolean,
        default: false,
    },
    subscriptionStartDate: {
        type: Date,
    },
    subscriptionEndDate: {
        type: Date,
    },        
},
{
    timestamps: true,
});

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otpExpires: {
        type: Date,
    },
},
{
    timestamps: true,
});

const querySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    query: {
        type: String,
        required: true,
    },
    isAnswered: {
        type: Boolean,
        default: false,
    },
    answer: {
        type: String,
    },
    image: {
        type: String,
    },
    subject: {
        type: String,
        required: true,
    },
},
{
    timestamps: true,
});

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    image: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    likedMovies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
        },
    ],
    watchedMovies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
        },
    ],
    payment: [paymentSchema],
    hasPaid: {
        type: Boolean,
        default: false,
    },
},
{
    timestamps: true,
});

const UserModel = mongoose.model("User", userSchema);
const PaymentModel = mongoose.model("Payment", paymentSchema);
const OtpModel = mongoose.model("Otp", otpSchema);
const QueryModel = mongoose.model("Query", querySchema);

export { UserModel, PaymentModel, OtpModel, QueryModel };

