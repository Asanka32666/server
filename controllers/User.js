import joi from "@hapi/joi";
import jwt from "jsonwebtoken";
import Cryptr from "cryptr";

// Models
import {
  StaffDetailsModel,
  StudentDetailsModel,
} from "../models/UserDetails.js";
import { StudentModel, StaffModel } from "../models/User.js";

// Functions
import { checkMailExist } from "./functions/User.js";
import { sendEmail } from "./functions/Mail.js";
import { encrypt, decrypt } from "./functions/Hash.js";

export const userRegister = async (req, res, next) => {
  if (req.body.type === "student") {
    const validationSchema = joi.object({
      nic: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
      type: joi.string().required(),
    });
    const { error } = validationSchema.validate(req.body, {
      abortEarly: false,
    });
    // Check basic Validation
    if (error) {
      const errors = {};
      error.details.map((err) => {
        errors[err.context.key] = err.message;
      });
      return res.send(encrypt({ has_errors: true, errors: errors }));
    }
    // Check nic is valid
    const student_details = await StudentDetailsModel.find({
      NIC: req.body.nic,
    });
    if (student_details.length === 0)
      return res.send(
        encrypt({
          has_errors: true,
          errors: { nic: "Your NIC doesn't registered in our system" },
        })
      );

    // Check mail already exist
    if (await checkMailExist(req.body.email))
      return res.send(
        encrypt({
          has_errors: true,
          errors: { email: "This email is already exist. Try another one" },
        })
      );

    // Sent Verification code to user mail
    const verification_code = Math.floor(Math.random() * 99999 + 100000);
    if (
      !(await sendEmail(req.body.email, "VTA Account Verification", {
        name: student_details[0].FullName,
        v_code: verification_code,
      }))
    )
      return res.send(
        encrypt({
          has_errors: false,
          status: false,
          message:
            "Verification email send fail. Please try again after few moments.",
        })
      );
    // Register Student
    const cryptr = new Cryptr(process.env.PASSWORD_SECRET);
    const hashed_password = cryptr.encrypt(req.body.password);
    const Student = new StudentModel({
      nic: req.body.nic,
      email: req.body.email,
      p_image: "P_image.png",
      c_image: "C_image.png",
      password: hashed_password,
      login_token: "Login Token",
      is_login: false,
      verification_code: verification_code,
      is_active: false,
      is_disabled: false,
      try: 0,
    });

    try {
      const student_details = await Student.save();
      res
        .header({
          token: jwt.sign(
            { _id: student_details._id, type: "student" },
            process.env.TOKEN_SECRET
          ),
        })
        .send(encrypt({ has_errors: false, status: true }));
    } catch (error) {
      res.send(
        encrypt({
          has_error: true,
          status: false,
          message: error.message,
        })
      );
    }
  } else if (req.body.type === "staff") {
    const validationSchema = joi.object({
      epf: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().min(8).required(),
      type: joi.string().required(),
    });
    const { error } = validationSchema.validate(req.body, {
      abortEarly: false,
    });
    // Check basic Validation
    if (error) {
      const errors = {};
      error.details.map((err) => {
        errors[err.context.key] = err.message;
      });
      return res.send(encrypt({ has_errors: true, errors: errors }));
    }
    // Check epf is valid
    const staff_details = await StaffDetailsModel.find({
      EPF: req.body.epf,
    });
    if (staff_details.length === 0)
      return res.send(
        encrypt({
          has_errors: true,
          errors: { epf: "Your EPF doesn't registered in our system" },
        })
      );
    // Check mail already exist
    if (await checkMailExist(req.body.email))
      return res.send(
        encrypt({
          has_errors: true,
          errors: { email: "This email is already exist. Try another one" },
        })
      );
    // Sent Verification code to user mail
    const verification_code = Math.floor(Math.random() * 99999 + 100000);
    if (
      !(await sendEmail(
        req.body.email,
        "VTA Account Verification",
        `Your Account Verification Code : ${verification_code}`
      ))
    )
      return res.send(
        encrypt({
          has_errors: false,
          status: false,
          message:
            "Verification email send fail. Please try again after few moments.",
        })
      );
    // Register Staff
    const cryptr = new Cryptr(process.env.PASSWORD_SECRET);
    const hashed_password = cryptr.encrypt(req.body.password);
    const Staff = new StaffModel({
      epf: req.body.epf,
      email: req.body.email,
      nic: staff_details.NIC,
      p_image: "P_image.png",
      c_image: "C_image.png",
      password: hashed_password,
      login_token: "Login Token",
      is_login: false,
      verification_code: verification_code,
      is_active: false,
      is_disabled: false,
      try: 0,
    });
    try {
      const staff_details = await Staff.save();
      res
        .header({
          token: jwt.sign(
            { _id: staff_details._id, type: "staff" },
            process.env.TOKEN_SECRET
          ),
        })
        .send(encrypt({ has_errors: false, status: true }));
    } catch (error) {
      res.send(
        encrypt({
          has_error: true,
          status: false,
          message: error.message,
        })
      );
    }
  } else if (req.body.type === "company") {
  } else {
  }
};

export const userVerification = async (req, res) => {
  // Check V Code is Set
  if (!req.body.v_code)
    return res.send(
      encrypt({
        has_errors: true,
        errors: { v_code: "Verification Code required", type: "field" },
      })
    );
  // Check V Code is not empty
  if (req.body.v_code === "")
    return res.send(
      encrypt({
        has_errors: true,
        errors: {
          v_code: "Verification Code could not be empty",
          type: "field",
        },
      })
    );
  // Check token is set in header
  if (!req.headers.auth)
    return res.send(
      encrypt({
        has_errors: true,
        errors: { message: "Access Denied", type: "alert" },
      })
    );
  // Check token is valid
  try {
    jwt.verify(
      req.headers.auth,
      process.env.TOKEN_SECRET,
      async (error, user) => {
        if (error)
          return res.send(
            encrypt({
              has_errors: true,
              errors: {
                message: "Access Denied. (invalid authorization)",
                type: "alert",
              },
            })
          );
        if (user.type === "student") {
          const student_data = await StudentModel.findById(user._id);
          if (!student_data)
            return res.send(
              encrypt({
                has_errors: true,
                errors: { message: "Account Verification fail", type: "alert" },
              })
            );
          if (student_data.verification_code !== req.body.v_code)
            return res.send(
              encrypt({
                has_errors: true,
                errors: {
                  type: "field",
                  v_code: "Your verification code is not valid",
                },
              })
            );
          // Login Token set and set is_active
          const login_token = jwt.sign(
            { _id: user._id, type: "student" },
            process.env.TOKEN_SECRET
          );
          const updated_student = await StudentModel.findByIdAndUpdate(
            student_data._id,
            { is_active: true, login_token: login_token, is_login: true }
          );
          if (!updated_student)
            return res.send(
              encrypt({
                has_errors: true,
                errors: { message: "Account Verification fail", type: "alert" },
              })
            );

          res.header({ token: login_token }).send(
            encrypt({
              has_errors: false,
              message: "Account Verification Success",
            })
          );
        } else if (user.type === "staff") {
          const staff_data = await StaffModel.findById(user._id);
          if (!staff_data)
            return res.send(
              encrypt({
                has_errors: true,
                errors: { message: "Account Verification fail", type: "alert" },
              })
            );
          if (staff_data.verification_code !== req.body.v_code)
            return res.send(
              encrypt({
                has_errors: true,
                errors: {
                  type: "field",
                  v_code: "Your verification code is not valid",
                },
              })
            );
          // Login Token set and set is_active
          const login_token = jwt.sign(
            { _id: user._id, type: "staff" },
            process.env.TOKEN_SECRET
          );
          const updated_staff = await StaffModel.findByIdAndUpdate(
            staff_data._id,
            { is_active: true, login_token: login_token, is_login: true }
          );
          if (!updated_staff)
            return res.send(
              encrypt({
                has_errors: true,
                errors: { message: "Account Verification fail", type: "alert" },
              })
            );

          res.header({ token: login_token }).send(
            encrypt({
              has_errors: false,
              message: "Account Verification Success",
            })
          );
        }
      }
    );
  } catch (error) {
    return res.send(
      encrypt({
        has_errors: true,
        errors: { message: "Account Verification fail", type: "alert" },
      })
    );
  }
};

// Login
export const userLogin = async (req, res) => {
  const validationSchema = joi.object({
    nic: joi.string().required(),
    password: joi.string().min(8).required(),
  });
  const { error } = validationSchema.validate(
    { nic: req.body.nic, password: req.body.password },
    {
      abortEarly: false,
    }
  );
  // Check basic Validation
  if (error) {
    const errors = {};
    error.details.map((err) => {
      errors[err.context.key] = err.message;
    });
    errors["type"] = "field";
    return res.send(encrypt({ has_errors: true, errors: errors }));
  }

  try {
    if (req.body.type === "student") {
      const student = await StudentModel.findOne({
        nic: req.body.nic,
        is_active: true,
      });

      if (student) {
        const cryptr = new Cryptr(process.env.PASSWORD_SECRET);
        const decryptedPassword = cryptr.decrypt(student.password);
        if (decryptedPassword === req.body.password) {
          const token = jwt.sign(
            { _id: student._id, type: "student" },
            process.env.TOKEN_SECRET
          );
          const updated_student = await StudentModel.findByIdAndUpdate(
            student._id,
            { login_token: token, is_login: true }
          );
          if (updated_student)
            return res
              .header({
                token: token,
              })
              .send(encrypt({ has_errors: false, status: true }));
          return res.send(
            encrypt({
              has_errors: true,
              errors: { type: "alert", message: "SingUp was Fail" },
            })
          );
        }
        return res.send(
          encrypt({
            has_errors: true,
            errors: {
              type: "alert",
              message:
                "The NIC or Password that you've entered doesn't match any account. Sign up for an account.",
            },
          })
        );
      }
      return res.send(
        encrypt({
          has_errors: true,
          errors: {
            type: "alert",
            message:
              "The NIC or Password that you've entered doesn't match any account. Sign up for an account.",
          },
        })
      );
    } else if (req.body.type === "staff") {
      const staff = await StaffModel.findOne({
        nic: req.body.nic,
        is_active: true,
      });
      if (staff.length !== 0) {
        const cryptr = new Cryptr(process.env.PASSWORD_SECRET);
        const decryptedPassword = cryptr.decrypt(staff.password);
        if (decryptedPassword === req.body.password) {
          const token = jwt.sign(
            { _id: staff._id, type: "staff" },
            process.env.TOKEN_SECRET
          );
          const updated_staff = await StaffModel.findByIdAndUpdate(staff._id, {
            login_token: token,
            is_login: true,
          });
          if (updated_staff.length !== 0) {
            return res
              .header({
                token: token,
              })
              .send(encrypt({ has_errors: false, status: true }));
          }
          return res.send(
            encrypt({
              has_errors: true,
              errors: { type: "alert", message: "SingUp is Fail" },
            })
          );
        }
        return res.send(
          encrypt({
            has_errors: true,
            errors: {
              type: "alert",
              message:
                "The NIC or Password that you've entered doesn't match any account. Sign up for an account.",
            },
          })
        );
      }
      return res.send(
        encrypt({
          has_errors: true,
          errors: {
            type: "alert",
            message:
              "The NIC or Password that you've entered doesn't match any account. Sign up for an account.",
          },
        })
      );
    } else if (req.body.type === "company") {
    }
    return res.send(
      encrypt({
        has_errors: true,
        errors: {
          type: "alert",
          message:
            "The NIC or Password that you've entered doesn't match any account. Sign up for an account.",
        },
      })
    );
  } catch (error) {
    return res.send(
      encrypt({
        has_errors: true,
        errors: {
          type: "alert",
          message: error.message,
        },
      })
    );
  }
};

export const checkToken = (req, res) => {
  if (!req.body.token) return res.send(encrypt({ is_login: false }));

  jwt.verify(req.body.token, process.env.TOKEN_SECRET, async (error, user) => {
    if (error) return res.send(encrypt({ is_login: false }));

    try {
      if (user.type === "student") {
        const student = await StudentModel.findById(user._id);
        if (student) {
          if (student.is_login) {
            return res.send(encrypt({ is_login: true }));
          } else {
            return res.send(encrypt({ is_login: false }));
          }
        } else {
          return res.send(encrypt({ is_login: false }));
        }
      }
    } catch (error) {
      return res.send(encrypt({ is_login: false }));
    }
  });
};
