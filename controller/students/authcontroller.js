const Students = require("../../models/students");
const sendOTP = require("../../common/sendOTP");
const generateOTP = require("../../common/generateOTP");
const JWTService = require("../../services/jwtservice");
const RefreshToken = require("../../models/token");
const Joi = require("joi");
var generatedotp = 0;
var phoneNumber = "";
const studentauthcontroller = {
  async getOTP(req, res, next) {
    const studentLoginSchema = Joi.object({
      phone: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
      testing: Joi.boolean(),
    });

    // validate user input
    const { error } = studentLoginSchema.validate(req.body);

    // if error occured -> return error by middleware
    if (error) {
      return next(error);
    }

    // Gertting the values
    const { phone } = req.body;
    phoneNumber = phone;

    if (phone === "9111111111") {
      generatedotp = 9111;
    } else {
      generatedotp = generateOTP();
      await sendOTP(`+91${phone}`, generatedotp);
    }


    const verificationOTP = generatedotp * 9;
    return res.status(201).json({ verifyotp: verificationOTP, phone: phone });
  },
  async login(req, res, next) {
    const userLoginSchema = Joi.object({
      otp: Joi.number().required(),
      verifyotp: Joi.number().required(),
      phone: Joi.number().required(),
    });

    // validate user input
    const { error } = userLoginSchema.validate(req.body);

    // if error occured -> return error by middleware
    if (error) {
      return next(error);
    }

    const { otp, verifyotp, phone } = req.body;
    // check if server is in testing
    verify = verifyotp / 9;

    if (verify == otp) {
      student = await Students.findOne({ phone: phone });
      if (!student) {
        const studentToRegister = new Students({
          firstname: "NA",
          profieImage: null,
          email: "NA",
          pack: "Copyright Handbook",
          registeredExam: "IPTSE",
          source: "NA",
          phone: phone,
          address: null,
        });
        student = await studentToRegister.save();

        const _id = student._id;

        accessToken = JWTService.signAccessToken({ _id: _id }, "7200m");

        await RefreshToken.updateOne(
          { token: accessToken },
          {
            upsert: true,
            // update OR create New
          }
        );

        return res.status(201).json({
          msg: "OTP Matched",
          accessToken: accessToken,
          _id: _id,
          registered: false,
        });
      } else {
        const _id = student._id;

        accessToken = JWTService.signAccessToken({ _id: _id }, "7200m");

        await RefreshToken.updateOne(
          { token: accessToken },
          {
            upsert: true,
            // update OR create New
          }
        );

        return res.status(201).json({
          msg: "OTP Matched",
          _id: _id,
          accessToken: accessToken,
          registered: true,
        });
      }
    } else {
      const error = {
        status: 401,
        message: "Invalid OTP",
      };
      return next(error);
    }
  },
  async create(req, res, next) {
    const userCreateSchema = Joi.object({
      firstname: Joi.string(),
      lastname: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      profession: Joi.string(),
      organization: Joi.string(),
      state: Joi.string(),
      registeredexam: Joi.string(),
      source: Joi.string(),
      pack: Joi.string(),
    });

    // validate user input
    const { error } = userCreateSchema.validate(req.body);

    // if error occured -> return error by middleware
    if (error) {
      return next(error);
    }

    const {
      firstname,
      lastname,
      email,
      phone,
      profession,
      organization,
      state,
      source,
      registeredexam,
      pack,
    } = req.body;
    // check if server is in testing
    const studentToRegister = new Students({
      firstname,
      lastname,
      email,
      phone,
      profession,
      organization,
      state,
      source,
      registeredexam,
      pack,
    });
    student = await studentToRegister.save();

    const _id = student._id;

    accessToken = JWTService.signAccessToken({ _id: _id }, "7200m");

    await RefreshToken.updateOne(
      { token: accessToken },
      {
        upsert: true,
        // update OR create New
      }
    );
    return res.status(201).json({
      msg: "Student Added Successfully",
    });
  },
  async bulkRegistration(req, res, next) {

    req.body.map(async (item) => {

      const student = await Students.findOne({ phone: item.phone });

      if (!student) {
        // check if server is in testing
        const studentToRegister = new Students({
          firstname: item.firstname,
          lastname: item.lastname,
          email: item.email,
          phone: item.phone,
          profession: item.profession,
          organization: item.organization,
          state: item.state,
          source: item.source,
          registeredexam: item.registeredexam,
          pack: item.pack,
        });

        await studentToRegister.save();

      }
    })

    return res.status(201).json({
      msg: "Bulk registration Added Successfully",
    });
  },
  async update(req, res, next) {
    try {
      const studentToUpdate = req.body;

      const _id = req.params.id;

      await Students.findByIdAndUpdate(
        _id,
        studentToUpdate
      );

      return res.status(201).json({ msg: "Data Submitted Successfully" });
    } catch (error) {
      return next(error);
    }
  },
  async editsubdomain(req, res, next) {
    try {
      const { subprofession } = req.body;
      const _id = req.params.id;
  
      const updateFields = {};
      if (subprofession) {
        updateFields.subprofession = subprofession;
      }
  
      const resp = await Students.findByIdAndUpdate(_id, updateFields, { new: true });
  
      if (!resp) {
        return res.status(404).json({ error: 'Subprofession not found' });
      }
      return res.status(200).json(resp);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },  
  async bookslot(req, res, next) {
    try {
      const { examId , slot } = req.body;
      const _id = req.params.id;

      const examsData = {
        examId:examId,
        slot:slot
      }

      const resp = await Students.findByIdAndUpdate(_id, {exams:examsData});
  
      if (!resp) {
        return res.status(404).json({ error: 'Please try Again' });
      }
      return res.status(200).json(resp);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },  
  async getById(req, res, next) {
    try {
      const _id = req.params.id;

      const user = await Students.findById(_id);

      return res.status(201).json({ data: user });
    } catch (error) {
      return next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const user = await Students.find();
      return res.status(201).json({ user: user });
    } catch (error) {
      return next(error);
    }
  },
  async delete(req, res, next) {
    const id = req.params.id;
    try {
      const deletedCourse = await Students.findByIdAndDelete(id);
      res.status(200).json({ msg: "Student Deleted Successfully" });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = studentauthcontroller;
