const Joi = require("joi");
const ExamResult = require("../models/examResult");

const examResultController = {
    async create(req, res, next) {

        // Getting All Values using the request
        const { studentId, examId, score, answer,totalScore,timeTaken } = req.body;

        //Store In DB
        try {
            const createExam = new ExamResult({
                studentId, examId, score, answer,totalScore,timeTaken
            });
            result = await createExam.save();
            res.status(201).json({ success: true });
        } catch (error) {
            next(error);
        }
    },
    async getAll(req, res, next) {
        try {
            const exams = await ExamResult.find().populate('examId').populate('studentId');
            let data = exams;
            exams.length > 0  && exams.map((item,index)=>{
                data[index].examId.questions = 'Not allowed';
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
            const singleExam = await ExamResult.findById(_id);
            res.status(200).json(singleExam);
        } catch (error) {
            return next(error);
        }
    },
    async getByStudentId(req, res, next) {
        // Getting All Values using the request
        const _id = req.params.id;
        try {
            var Exam = await ExamResult.find({ studentId: _id }).populate('examId').populate('studentId');
            const filteredExams = Exam?.map(result => {
                // Create a new object without the 'questions' property
                if (result?.examId) {
                    const { questions, ...examIdWithoutQuestions } = result?.examId?.toObject();
                    return {
                        ...result.toObject(),
                        examId: examIdWithoutQuestions,
                    };
                }
            });
            res.status(200).json(filteredExams);
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
            const updatedExam = await ExamResult.findByIdAndUpdate(id, { status });
            res.status(200).json({ msg: "Exam Updated Successfully" });
        } catch (error) {
            next(error);
        }

    },
    async StatusUpdate(req, res, next) {
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
            const updatedExam = await ExamResult.findByIdAndUpdate(id, { status });
            res.status(200).json({ msg: "Exam Updated Successfully" });
        } catch (error) {
            next(error);
        }

    },
    async delete(req, res, next) {
        const id = req.params.id;
        try {
            await ExamResult.findByIdAndDelete(id);
            res.status(200).json({ msg: "Exam Deleted Successfully" });
        } catch (error) {
            return next(error);
        }
    },
};

module.exports = examResultController;
