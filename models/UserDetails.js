import mongoose from "mongoose";
const Schema = mongoose.Schema;

const studentDetailsSchema = new Schema({
  OrgaName: {
    type: String,
  },
  CourseListCode: {
    type: String,
  },
  CourseListCode: {
    type: String,
  },
  CourseCode: {
    type: String,
  },
  Batch: {
    type: String,
  },
  year: {
    type: String,
  },
  NIC: {
    type: String,
  },
  NameWithInitials: {
    type: String,
  },
  FullName: {
    type: String,
  },
  Address: {
    type: String,
  },
  DistrictName: {
    type: String,
  },
  ProvinceName: {
    type: String,
  },
  DOB: {
    type: String,
  },
  Gender: {
    type: String,
  },
  Tel_mob: {
    type: String,
  },
  training_no: {
    type: String,
  },
});

const staffDetailsSchema = new Schema({
  DistrictName: {
    type: String,
  },
  OrgaName: {
    type: String,
  },
  EPF: {
    type: String,
  },
  Initials: {
    type: String,
  },
  Name: {
    type: String,
  },
  LastName: {
    type: String,
  },
  NIC: {
    type: String,
  },
  Gender: {
    type: String,
  },
  OEmail: {
    type: String,
  },
  Email: {
    type: String,
  },
  P_ID: {
    type: String,
  },
  OMobile: {
    type: String,
  },
  Mobile: {
    type: String,
  },
  DOB: {
    type: String,
  },
  StartDate: {
    type: String,
  },
  Designation: {
    type: String,
  },
  // TradeName: {
  //     type: Null
  // },
});

export const StudentDetailsModel = mongoose.model(
  "student_details",
  studentDetailsSchema
);
export const StaffDetailsModel = mongoose.model("staff_details", staffDetailsSchema);

