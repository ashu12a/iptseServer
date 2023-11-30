const Joi = require("joi");
const Razorpay = require("razorpay");
const Order = require("../models/order");

const razorpay = new Razorpay({
  key_id: "rzp_live_JoK3xUSKfiWHjH",
  key_secret: "H9UHiht0Q3bpF8K99UulTvF9",
});

const orderController = {
  async create(req, res, next) {
    const orderControllerSchema = Joi.object({
      pack: Joi.string().required(),
      desc: Joi.string().required(),
      amount: Joi.number().required(),
    });

    // validate user input
    const { error } = orderControllerSchema.validate(req.body);

    // if error occured -> return error by middleware
    if (error) {
      return next(error);
    }

    // Getting All Values using the request
    const { pack, desc, amount } = req.body;

    const options = {
      amount: amount, // Amount in paise (multiply by 100 as Razorpay expects amount in paise)
      currency: "INR", // Eg: 'INR'
      receipt: 'IPTSE_PACK_RECEIPT', // Your unique receipt ID
      payment_capture: 1, // Auto capture the payment
      notes: {
        description: desc,
      },offers: [
        "offer_Me8TiWDoS0PG3G",
        "offer_Me8SrDt1hgwI6E",
        "offer_Me8RYBcceyKIc0",
        "offer_Me8QIkZV1Uj85R"
      ]
    };

    try {
      const response = await razorpay.orders.create(options);
      return res
        .status(200)
        .json({ data: response });
    } catch (error) {
      return next(error);
    }
  },
  async verify(req, res, next) {
    const orderControllerSchema = Joi.object({
      orderid: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().required(),
      pack: Joi.string().required(),
      desc: Joi.string().required(),
      amount: Joi.string().required(),
      status: Joi.string().required(),
    });

    // validate user input
    const { error } = orderControllerSchema.validate(req.body);

    // if error occured -> return error by middleware
    if (error) {
      console.log(error);
      return next(error);
    }

    // Getting All Values using the request
    const { name,email,orderid, pack, desc, amount, status } = req.body;

    //Store In DB
    try {
      const createOrder = new Order({
        name,
        email,
        orderid,
        pack,
        desc,
        amount,
        status,
      });
      result = await createOrder.save();
      res.status(201).json({ msg: "Payment Successfull" });
    } catch (error) {
      next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const course = await Order.find();
      res.status(200).json(course);
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = orderController;
