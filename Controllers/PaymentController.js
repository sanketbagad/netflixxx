import { PaymentModel } from "../Models/UsersModel";
import { UserModel } from "../Models/UsersModel";


const createPayment = async (req, res) => {
    const {paymentMethod, hasPaid, paymentResult } = req.body;


    try {
        const payment = await PaymentModel.create({
            paymentMethod,
            hasPaid,
            paymentResult,
            userId: req.user._id,
        });

       // if paymentResult is successful, update the user's hasPaid to true
        if (paymentResult === "COMPLETED") {
            const user = await UserModel.findById(req.user._id);
            user.payment.hasPaid = true;
            user.hasPaid = true;
            // also update the user's subscriptionStartDate and subscriptionEndDate
            const today = new Date();
            const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
            user.payment.subscriptionStartDate = today;
            user.payment.subscriptionEndDate = nextMonth;
            await user.save();
        } else {
            res.status(400);
            throw new Error("Payment not successful");
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const updatePayment = async (req, res) => {
    const {paymentMethod, hasPaid, paymentResult } = req.body;

    try {
        const payment = await PaymentModel.findById(req.params.id);
        if (payment) {
            payment.paymentMethod = paymentMethod || payment.paymentMethod;
            payment.hasPaid = hasPaid || payment.hasPaid;
            payment.paymentResult = paymentResult || payment.paymentResult;
            const updatedPayment = await payment.save();
            res.json(updatedPayment);
        } else {
            res.status(404);
            throw new Error("Payment not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const endSubscription = async (req, res) => {
    // if the user's subscriptionEndDate is less than today's date, set hasPaid to false
    const today = new Date();

    try {
        const user = await UserModel.findById(req.user._id);
        if (user.payment.subscriptionEndDate < today) {
            user.payment.hasPaid = false;
            user.hasPaid = false;
            await user.save();
        } else {
            res.status(404);
            throw new Error("Subscription not found");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { createPayment, updatePayment, endSubscription };




