const Joi = require("joi");
const Course = require("../models/course");

const courseController = {
  async create(req, res, next) {
    const courseCreateSchema = Joi.object({
      name: Joi.string().required(),
      pages: Joi.number().integer().required(),
      minutes: Joi.number().integer().required(),
      pack: Joi.string().required(),
    });

    // validate user input
    const { error } = courseCreateSchema.validate(req.body);

    // if error occured -> return error by middleware
    if (error) {
      return next(error);
    }

    // Extract path of images and pdf
    const coverImage = req.files["coverImage"];
    var coverImagePath = "";
    for (const file of coverImage) {
      coverImagePath = file.path;
    }

    const course = req.files["course"];
    var coursePath = "";
    for (const file of course) {
      coursePath = file.path;
    }

    // Getting All Values using the request
    const { name, pages, minutes, pack } = req.body;
    var coverImagePathUpdate = coverImagePath.replace(/\\/g, "/");
    var coursePathUpdate = coursePath.replace(/\\/g, "/");

    //Store In DB
    try {
      const createCourse = new Course({
        name,
        pages,
        minutes,
        coverImage: coverImagePathUpdate,
        pack,
        course: coursePathUpdate,
      });
      result = await createCourse.save();
      res.status(201).json({ msg: "Course Created Successfully" });
    } catch (error) {
      next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const course = await Course.find();
      res.status(200).json(course);
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    // Getting All Values using the request
    const _id = req.params.id;
    try {
      const singleCourse = await Course.findById(_id);
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
    // Extract path of images and pdf
    if (req.files["coverImage"]) {
      const fileUsed = req.files["coverImage"];
      var coverImagePath = "";
      for (const file of fileUsed) {
        coverImagePath = file.path;
      }
      req.body.coverImage = coverImagePath.replace(/\\/g, "/");
    }

    if (req.files["course"]) {
      const UsedFile = req.files["course"];
      var coursePath = "";
      for (const file of UsedFile){
        coursePath = file.path;
      }
      req.body.course= coursePath.replace(/\\/g, "/");
    }

    const _id = req.params.id;
    const DataToUpdate = req.body;
    //Store In DB
    try {
      await Course.findByIdAndUpdate(
        _id,
        DataToUpdate
      );
      res.status(201).json({ msg: "Course Updated Successfully" });
    } catch (error) {
      next(error);
    }
  },
  async delete(req, res, next) {
    const id = req.params.id;
    try {
      await Course.findByIdAndDelete(id);
      res.status(200).json({ msg: "Course Deleted Successfully" });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = courseController;
