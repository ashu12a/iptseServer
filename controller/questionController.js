const Joi = require("joi");
const Question = require('../models/question');

const questionController = {
  async create(req, res, next) {
    var answer1 = req.body.answer;
    req.body['answer'] = req.body[answer1];
    console.log(req.body);
    // res.status(201).json({ msg: "Question Added Successfully" });
    const courseCreateSchema = Joi.object({
        name: Joi.string().required(),
        exam: Joi.string().required(),
        answer: Joi.string().required(),
        option1: Joi.string().required(),
        option2: Joi.string().required(),
        option3: Joi.string().required(),
        option4: Joi.string().required()
      });
  
      // validate user input
      const { error } = courseCreateSchema.validate(req.body);
  
      // if error occured -> return error by middleware
      if (error){
        return next(error);
      }
  
      // Getting All Values using the request
      const { name, exam, answer, option1, option2, option3, option4 } = req.body;

  
      //Store In DB
      try {
        const createQuestion = new Question({
            name, exam, answer, option1, option2, option3, option4
        });
        result = await createQuestion.save();
        res.status(201).json({ msg: "Question Added Successfully" });
      } catch (error) {
        next(error);
      }

  },
  async getAll(req, res, next) {
    try{
      const questions = await Question.find();
      res.status(200).json(questions);
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
   
  },
  async update(req, res, next) {},
  async delete(req, res, next) {
    const id = req.params.id;
    try {
      const deletedQuestion = await Question.findByIdAndDelete(id);
      res.status(200).json({msg:"Question Deleted Successfully"});
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = questionController;
