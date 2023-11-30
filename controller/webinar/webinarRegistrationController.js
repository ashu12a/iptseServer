const WebinarRegistration = require("../../models/webinarRegistration");

const webinarRegistrationController = {
    async create(req, res, next) {

        // Getting All Values using the request
        const {
            studentId,
            webinarId
        } = req.body;

        //Store In DB
        try {
            const createCourse = new WebinarRegistration({
                studentId,
                webinarId
            });
            result = await createCourse.save();
            res.status(200).json({ msg: "Webinar Registration Successfully" });
        } catch (error) {
            next(error);
        }
    },
    async getAll(req, res, next) {
        try {
            const data = await WebinarRegistration.find();
            res.status(200).json(data);
        } catch (error) {
            return next(error);
        }
    },
    async getPopulatedData(req, res, next) {
        try {
            const data = await WebinarRegistration.find().populate('studentId').populate('webinarId');
            res.status(200).json(data);
        } catch (error) {
            return next(error);
        }
    },
    async getById(req, res, next) {
        // Getting All Values using the request
        const _id = req.params.id;
        try {
            const singleCourse = await WebinarRegistration.findById(_id);
            res.status(200).json(singleCourse);
        } catch (error) {
            return next(error);
        }
    },
    async getByStudentId(req, res, next) {
        // Getting All Values using the request
        const id = req.params.id;
        try {
            const singleCourse = await WebinarRegistration.find({ studentId: id });
            res.status(200).json(singleCourse);
        } catch (error) {
            return next(error);
        }
    },
    async update(req, res, next) {
        // Extract path of images and pdf
        const _id = req.params.id;
        const DataToUpdate = req.body;
        //Store In DB
        try {
            await WebinarRegistration.findByIdAndUpdate(_id, DataToUpdate);
            res.status(201).json({ msg: "Webinar Registration Updated Successfully" });
        } catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        const id = req.params.id;
        try {
            await WebinarRegistration.findByIdAndDelete(id);
            res.status(200).json({ msg: "Webinar Registration Deleted Successfully" });
        } catch (error) {
            return next(error);
        }
    },
};

module.exports = webinarRegistrationController;
