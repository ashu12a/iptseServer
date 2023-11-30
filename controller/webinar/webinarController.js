const Joi = require("joi");
const Webinar = require("../../models/webinar");

const webinarController = {
  async create(req, res, next) {
    const webinarCreateSchema = Joi.object({
      name: Joi.string().required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      link: Joi.string().required(),
      platform: Joi.string().required(),
      institute: Joi.string().required(),
      desc: Joi.string().required(),
      speaker: Joi.string().required(),
    });

    // validate user input
    const { error } = webinarCreateSchema.validate(req.body);

    // if error occured -> return error by middleware
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Extract path of images and pdf
    const coverImagePath = req.file.path;
    var coverImagePathUpdate = coverImagePath.replace(/\\/g, "/");

    // Getting All Values using the request
    const {
      name,
      startDate,
      endDate,
      link,
      platform,
      institute,
      desc,
      speaker
    } = req.body;

    const speakerData = JSON.parse(speaker);
    //Store In DB
    try {
      const createCourse = new Webinar({
      name,
      startDate,
      endDate,
      link,
      platform,
      institute,
      desc,
      speaker:speakerData,
      banner : coverImagePathUpdate,
      });
      result = await createCourse.save();
      res.status(201).json({ msg: "Webinar Created Successfully" });
    } catch (error) {
      next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const data = await Webinar.find();
      res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    // Getting All Values using the request
    const _id = req.params.id;
    try {
      const singleCourse = await Webinar.findById(_id);
      res.status(200).json(singleCourse);
    } catch (error) {
      return next(error);
    }
  },
  async getByPack(req, res, next) {
    // Getting All Values using the request
    const pack = req.params.pack;
    try {
      const singleCourse = await Course.find({ pack: pack });
      res.status(200).json(singleCourse);
    } catch (error) {
      return next(error);
    }
  },
  async update(req, res, next) {
    const _id = req.params.id;
    const DataToUpdate = req.body;

    if(typeof(req.body.banner) !== 'string'){
      const coverImagePath = req.file.path;
      DataToUpdate['banner'] = coverImagePath.replace(/\\/g, "/");
      }
    //Store In DB
    try {
      await Webinar.findByIdAndUpdate(_id, DataToUpdate);
      res.status(201).json({ msg: "Webinar Updated Successfully" });
    } catch (error) {
      next(error);
    }
  },
  async delete(req, res, next) {
    const id = req.params.id;
    try {
      await Webinar.findByIdAndDelete(id);
      res.status(200).json({ msg: "Webinar Deleted Successfully" });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = webinarController;
