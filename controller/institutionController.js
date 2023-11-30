const Joi = require("joi");
const Institution = require("../models/Institutions");

const institutionController = {
  async create(req, res, next) {
    const institutionCreateSchema = Joi.object({
      name: Joi.string().required(),
      city: Joi.string().required(),
      logo: Joi.string(),
    });

    // validate user input
    const { error } = institutionCreateSchema.validate(req.body);

    // if error occured -> return error by middleware
    if (error) {
      return next(error);
    }

   
    // Getting All Values using the request
    const { name, city } = req.body;

    var logo = "NA"

    if(typeof(req.body.logo) !== 'string'){
      const coverImagePath = req.file.path;
       logo = coverImagePath.replace(/\\/g, "/");
    }
  

    //Store In DB
    try {
      const createCourse = new Institution({
        name,
        logo,
        city
      });
      result = await createCourse.save();
      res.status(201).json({ msg: "Institutions Created Successfully" });
    } catch (error) {
      next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const data = await Institution.find();
      res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    // Getting All Values using the request
    const _id = req.params.id;
    try {
      const single = await Institution.findById(_id);
      res.status(200).json(single);
    } catch (error) {
      return next(error);
    }
  },
  async update(req, res, next) {
    const _id = req.params.id;
    var DataToUpdate = req.body;

    if(typeof(req.body.logo) !== 'string'){
    const coverImagePath = req.file.path;
    DataToUpdate['logo'] = coverImagePath.replace(/\\/g, "/");
    }

    

    //Store In DB
    try {
      await Institution.findByIdAndUpdate(
        _id,
        DataToUpdate
      );
      res.status(201).json({ msg: "Institution Updated Successfully" });
    } catch (error) {
      next(error);
    }
  },
  async delete(req, res, next) {
    const id = req.params.id;
    try {
      await Institution.findByIdAndDelete(id);
      res.status(200).json({ msg: "Institution Deleted Successfully" });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = institutionController;
