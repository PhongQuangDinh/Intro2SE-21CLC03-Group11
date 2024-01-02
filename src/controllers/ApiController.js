const AccountService = require("../services/Authentication_Service");
const MailService = require("../services/SendEmailService");

const controller = {};

controller.isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email);
}

controller.resetPasswordByEmail = async (req, res) => {
  const DEFAULT_PASSWORD_LENGTH = 12;
  const { type, data } = req.body;
  if (data == null || !controller.isValidEmail(data)) {
    res.status(400).json({ message: "Your email is not qualified" });
    return;
  }

  const user = await AccountService.getAccountByEmail(data);
  if (user == undefined || user == null) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    // generate new password
    const newPassword = AccountService.generateNewPassword(DEFAULT_PASSWORD_LENGTH);
    console.log('New Password: [', newPassword, ']');
    // reset password
    await AccountService.updateAccountPassword(user.account_id, newPassword);
    // send email to user
    MailService.sendEmail(user.email, newPassword);
  } catch (err) {
    return res.status(501).json({ message: "Server error" });
  }

  return res.status(200).json({ message: "Password has been reset" });
};

controller.resetPasswordByPhoneNumbers = async (req, res) => {
  res.status(200).json({ message: "TEST" });
};

module.exports = controller;
