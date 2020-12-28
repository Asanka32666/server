import mongoose from "mongoose";
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    nic: {
      type: String,
    },
    email: {
      type: String,
    },
    p_image: {
      type: String,
    },
    c_image: {
      type: String,
    },
    password: {
      type: String,
    },
    login_token: {
      type: String,
    },
    is_login: {
      type: Boolean,
    },
    verification_code: {
      type: String,
    },
    try: {
      type: Number,
    },
    is_active: {
      type: Boolean,
    },
    is_disabled: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const staffSchema = new Schema(
  {
    epf: {
      type: String,
    },
    email: {
      type: String,
    },
    nic: {
      type: String
    },
    p_image: {
      type: String,
    },
    c_image: {
      type: String,
    },
    password: {
      type: String,
    },
    login_token: {
      type: String,
    },
    is_login: {
      type: Boolean,
    },
    verification_code: {
      type: String,
    },
    try: {
      type: Number,
    },
    is_active: {
      type: Boolean,
    },
    is_disabled: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const companySchema = new Schema(
  {
    reg_no: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    type: {
      type: String,
    },
    address: {
      type: String,
    },
    field: {
      type: String,
    },
    p_image: {
      type: String,
    },
    c_image: {
      type: String,
    },
    fax_no: {
      type: String,
    },
    district: {
      type: String,
    },
    sec_division: {
      type: String,
    },
    p_name: {
      type: String,
    },
    p_designation: {
      type: String,
    },
    p_phone: {
      type: String,
    },
    password: {
      type: String,
    },
    login_token: {
      type: String,
    },
    is_login: {
      type: Boolean,
    },
    verification_code: {
      type: String,
    },
    is_active: {
      type: Boolean,
    },
    is_disabled: {
      type: Boolean,
    },
    get_details: {
      type: Boolean,
    },
    try: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const StudentModel = mongoose.model("student", studentSchema);
export const StaffModel = mongoose.model("staff", staffSchema);
export const CompanyModel = mongoose.model("company", companySchema);
