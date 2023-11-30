const express = require("express");
const authController = require("../controller/authController");
const courseController = require("../controller/courseController");
const examController = require("../controller/examController");
const questionController = require("../controller/questionController");
const studentauthController  = require("../controller/students/authcontroller");
const orderController = require("../controller/orderController");
const institutionController = require("../controller/institutionController");

const auth = require("../middleware/auth");
// ------------------Students ------------------------------------------------
const studentauth = require("../middleware/studentauth");

const multer = require('multer');
const sendMail = require("../common/sendMail");
const webinarRegistration = require("../models/webinarRegistration");
const webinarRegistrationController = require("../controller/webinar/webinarRegistrationController");
const webinarController = require("../controller/webinar/webinarController");
const examResultController = require("../controller/examResultController");
const router = express.Router();
// configuration of multer for file upload
// configuration of multer for file upload
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({storage});
const multipleFiles = upload.fields([{name:'coverImage'},{name:'course'}]);

// ---------------------Welcome ---------------------
router.get("/", (req, res) => {
  res.json("Welcome to IPTSE Api");
});

// -------------------------User --------------------
router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", auth, authController.logout);
router.get("/refresh", auth, authController.refresh);
// ------------- Uncomment this-For Creating New Role ------------------------
// router.post('/role',authController.role);
//Bulk registration
router.post("/bulkRegistration", studentauthController.bulkRegistration);

// ------------------------Course --------------------------------------------
router.post("/course/add",[auth,multipleFiles],courseController.create);
router.get("/course/all", auth, courseController.getAll);
router.get("/course/:id", auth, courseController.getById);
router.put("/course/update/:id",[auth,multipleFiles],auth, courseController.update);
router.delete("/course/delete/:id", auth, courseController.delete);
// ----------------------------Exam ------------------
router.post("/exam/add",[auth,upload.single('img')],examController.create);
router.get("/exam/all", auth, examController.getAll);
router.get("/exam/:id", auth, examController.getById);
router.put("/exam/status/:id", auth, examController.update);
router.delete("/exam/delete/:id", auth, examController.delete);
router.put("/exam/question/update/:id", auth, examController.updateQuestions);

// ---------------------------Exam Results ---------------------------
router.get("/exam/results/all", auth, examResultController.getAll);
router.delete("/exam/result/delete/:id", auth, examResultController.delete);
router.put("/exam/result/update/:id", auth, examResultController.update);

//---------------------Questions ---------------------
router.post("/question/add", auth,questionController.create);
router.get("/question/all", auth,questionController.getAll);
router.delete("/question/delete/:id", auth, questionController.delete);

// ----------------Institution-----------------------
router.post("/institution/add",[auth,upload.single('logo')],institutionController.create);
router.get("/institution",auth,institutionController.getAll);
router.get("/institution/:id",auth,institutionController.getById);
router.put("/institution/update/:id",[auth,upload.single('logo')],institutionController.update);
router.delete("/institution/delete/:id",auth,institutionController.delete);

//----------------------Webinar---------------------------
router.post("/webinar/add",[auth,upload.single('banner')],webinarController.create);
router.get("/webinar/all",auth,webinarController.getAll);
router.put("/webinar/update/:id",[auth,upload.single('banner')],webinarController.update);
router.get("/webinar/:id",auth,webinarController.getById);
router.delete("/webinar/delete/:id",auth,webinarController.delete);
router.get("/webinar/registration/all",auth,webinarRegistrationController.getAll);
router.get("/webinar/registration/populated",auth,webinarRegistrationController.getPopulatedData);
router.delete("/webinar/registration/delete/:id",auth,webinarRegistrationController.delete);

// -------------------------------Students ----------------------------------------
router.get("/student",auth, studentauthController.getAll);
router.get("/v1/student/:id",auth, studentauthController.getById);
router.put("/v1/student/update/:id", auth, studentauthController.update);
router.post("/student/create",auth, studentauthController.create);
router.delete("/student/delete/:id", auth, studentauthController.delete);

// --------------------------------Orders-----------------
router.get("/orders/all",auth, orderController.getAll);

// ------------------------ Send Mail ------------------- 
router.get("/sendmail", sendMail);

// ---------------student login  ----------------
router.post("/student/login", studentauthController.login);
router.post("/student/getotp", studentauthController.getOTP);
router.get("/student/:id", studentauthController.getById);
router.get("/student/course/all",studentauth, courseController.getAll);
router.get("/student/course/:id", studentauth, courseController.getById);
router.get("/student/course/pack/:pack", studentauth, courseController.getByPack);
router.put("/student/update/:id", studentauth, studentauthController.update);
router.put("/student/subdomain/edit/:id", studentauth, studentauthController.editsubdomain);
router.put("/student/exam/bookslot/:id", studentauth, studentauthController.bookslot);
router.post("/student/order/create",studentauth, orderController.create);
router.post("/student/order/verify",studentauth, orderController.verify);
router.get("/student/exams/:domain/:subdomain", examController.getByDomain);
router.get("/student/exam/:id", studentauth, examController.getById);
router.post("/student/exam/result", studentauth, examResultController.create);
router.get("/student/exam/result/getByStudent/:id", examResultController.getByStudentId);
router.get("/student/webinar/all",studentauth,webinarController.getAll);
router.get("/student/webinar/:id",studentauth,webinarController.getById);
router.get("/student/institution/:id",studentauth,institutionController.getById);
router.get("/student/webinar/registration/:id",studentauth,webinarRegistrationController.getByStudentId);
router.post("/student/webinar/registration/create",studentauth,webinarRegistrationController.create); 

module.exports = router;
