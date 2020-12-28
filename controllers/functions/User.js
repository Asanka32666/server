import { StudentModel, StaffModel, CompanyModel } from "../../models/User.js";

export const checkMailExist = async (email) => {
  const student_details = await StudentModel.findOne({ email: email });

  if (student_details) {
    const student = await StudentModel.findById(student_details._id);
    if (student.is_active === true) {
      return true;
    } else {
      await StudentModel.findByIdAndDelete(student._id);
    }
  }

  const staff_details = await StaffModel.findOne({ email: email });
  if (staff_details) {
    const staff = await StaffModel.findById(staff_details._id);
    if (staff.is_active === true) {
      return true;
    } else {
      await StaffModel.findByIdAndDelete(staff._id);
    }
  }

  const company_details = await CompanyModel.findOne({ email: email });
  if (company_details) {
    const company = await CompanyModel.findById(company_details._id);
    if (company.is_active === true) {
      return true;
    } else {
      await CompanyModel.findByIdAndDelete(company._id);
    }
  }
  return false;
};
