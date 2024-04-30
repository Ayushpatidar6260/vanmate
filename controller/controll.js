import modelEx from "../model/model.js";
import jwt from "jsonwebtoken";
import { validate as validateEmail } from "email-validator";
import bcrypt from "bcrypt";

const PrivateKey = "djhgduwdy7d782iyd78wb78wuiw";
const saltRound = 10;

const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()><[]|:{}?""]/.test(password);

  return (
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChars &&
    password.length >= 6
  );
};

const validatePhoneNumber = (phoneNumber) => {
  const phonePattern = /^[0-9]{10}$/;
  return phonePattern.test(phoneNumber);
};

export const SignUp = async (req, res) => {
  try {
    const { Name, Email, Phone, Password, ConfirmPassword } = req.body;

    //Validate Email format

    if (!validateEmail(Email)) {
      return res.status(400).json({ msg: "Invalid email address" });
    }

    if (!validatePhoneNumber(Phone)) {
      return res.status(400).json({ msg: "Invalid Phone Number" });
    }

    if (!validatePassword(Password)) {
      return res.status(400).json({
        msg: "Password must contain at least  6chars long and one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    if (Password !== ConfirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const userExist = await modelEx.findOne({ $or: [{ Email }, { Phone }] });

    if (userExist) {
      return res.json({ msg: "User Already exists" });
    }

    const hasPassword = await bcrypt.hash(Password, saltRound);

    const UserData = await modelEx.create({
      Name,
      Email,
      Phone,
      Password,
    });

    const Token = jwt.sign({ userId: UserData._id }, PrivateKey, {
      expiresIn: "1hr",
    });

    await UserData.save();
    console.log(UserData);
    return res.json({ msg: "User Added Successfully", Token });
  } catch (error) {
    console.log("Signup Failed", error);
    return res.json({ msg: "SignUp failed Please check your details", error });
  }
};

// export const Login = async (req, res) => {
//   try {
//     const { EmailOrPhone, Password } = req.body;

//     let user;

//     const isEmail = validateEmail(EmailOrPhone);

//     if (isEmail) {
//       user = await modelEx.findOne({ Email: EmailOrPhone });
//     } else {
//       user = await modelEx.findOne({ Phone: EmailOrPhone });
//     }

//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     const match = await bcrypt.compare(Password, user.Password);

//     if (!match) {
//       return res.json({ msg: "Invailed Password" });
//     }

// if (user.Password !== Password) {
//   return res.status(401).json({ msg: "Invaild Password" });
// }

//     const token = jwt.sign({ userId: user._id }, PrivateKey, {
//       expiresIn: "1hr",
//     });
//     return res.json({ msg: "Login Successfull", token });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Login Failed", error });
//   }
// };
