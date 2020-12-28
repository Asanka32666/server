import mailer from "nodemailer";

// Template
import { template_01 } from "../data/MailTemplate.js";

export const sendEmail = async (to, subject, body) => {
  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // verify mail connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  const mailOption = {
    from: "vtalkmain@gmail.com",
    to: to,
    subject: subject,
    html: template_01(body),
  };

  try {
    const mail_result = await transporter.sendMail(mailOption);

    // if mail is success mail_result.rejected array is [] (empty)
    if (mail_result.rejected && mail_result.rejected.length === 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("TRY");
    return false;
  }
};
