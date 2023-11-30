const Joi = require("joi");
const Exam = require("../models/exam");

const examController = {
  async create(req, res, next) {
    // Getting All Values using the request
    const { name, desc, status, questions, minutes, domain, subdomain } = req.body;
  
    var img = "NA";
  
    if (typeof req.body.img !== 'string') {
      const coverImagePath = req.file.path;
      img = coverImagePath.replace(/\\/g, "/");
    }
  
    const questionUpdate = JSON.parse(questions);
  
    // Store In DB
    try {
      const createExam = new Exam({
        name,
        desc,
        status,
        domain,
        subdomain: subdomain, // Use the received subdomain value here
        questions: questionUpdate,
        minutes,
        img
      });
      
      // Save the exam instance with the overridden subdomain value
      result = await createExam.save();
      res.status(201).json({ msg: "Exam Created Successfully" });
    } catch (error) {
      next(error);
    }
  },
  async getAll(req, res, next) {
    try {
      const exams = await Exam.find();
      let data = exams;
      exams.length > 0  && exams.map((item,index)=>{
          data[index].questions = item.questions.length;
          return data;
      })
      res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    // Getting All Values using the request
    const _id = req.params.id;
    try {
      const singleExam = await Exam.findById(_id);
      res.status(200).json(singleExam);
    } catch (error) {
      return next(error);
    }
  },
  async getByDomain(req, res, next) {
    // Getting All Values using the request
    const domain = req.params.domain;
    const subdomain = req.params.subdomain;
    try {
      const singleExam = await Exam.find({domain:domain,subdomain:subdomain});
      res.status(200).json(singleExam);
    } catch (error) {
      return next(error);
    }
  },
 
  async update(req, res, next) {
    const id = req.params.id;
    const examUpdateSchema = Joi.object({
      status: Joi.bool().required(),
    });

    // validate user input
    const { error } = examUpdateSchema.validate(req.body);

    // if error occured -> return error by middleware
    if (error) {
      return next(error);
    }

    // Getting All Values using the request
    const { status } = req.body;

    //Store In DB
    try {
      const updatedExam = await Exam.findByIdAndUpdate(id, { status });
      res.status(200).json({ msg: "Exam Updated Successfully" });
    } catch (error) {
      next(error);
    }

  },
  async updateQuestions(req, res, next) {
    const id = req.params.id;

    // Getting All Values using the request
    const { excel } = req.body.data;
    
    if(!excel){
      res.status(400).json({
        msg:"Data not Found"
      })
    }


    //Store In DB
    try {
      const updatedExam = await Exam.findByIdAndUpdate(id, { questions:excel });
      res.status(200).json({ msg: "Exam Updated Successfully" });
    } catch (error) {
      next(error);
    }

  },
  async delete(req, res, next) {
    const id = req.params.id;
    try {
      const deletedExam = await Exam.findByIdAndDelete(id);
      res.status(200).json({ msg: "Exam Deleted Successfully" });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = examController;
