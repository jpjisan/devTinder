const validator = require("validator");
const bcrypt = require("bcrypt");
const dataValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required fields");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be at least 8 characters long");
  }
};
const validateEditProfile = (req) => {
  const ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "age",
    "about",
    "profilePicture",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((key) =>
    ALLOWED_FIELDS.includes(key)
  );

  return isEditAllowed;
};

module.exports = { dataValidation, validateEditProfile };
