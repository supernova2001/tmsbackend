import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import nodemailer from 'nodemailer'

export const register = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashing = bcrypt.hashSync(req.body.password, salt);

    // Generate a secret key for 2FA
    const tempSecret = speakeasy.generateSecret();
    const secretKey = tempSecret.base32;

    // Create a QR code URL for 2FA setup
    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secretKey,
      label: 'Tour Management System', // App's name
      issuer: 'TMS', 
    });

    const qrCodeImageUrl = await qrcode.toDataURL(otpAuthUrl);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashing,
      phone: req.body.phone,
      securityquestion1: req.body.securityquestion1,
      securityquestion2: req.body.securityquestion2,
      twoFactorSecret: secretKey,
    });

    await newUser.save();
    res.status(200).json({ success: true, message: 'User Successfully Created', qrCodeImageUrl, secretKey });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to Create User' });
    console.log(err);
  }
};

export const login = async (req, res) => {
    const email = req.body.email;
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const passwordCheck = await bcrypt.compare(req.body.password, user.password);
  
      if (!passwordCheck) {
        return res.status(401).json({ success: false, message: "Incorrect Password" });
      }
  
      
    // Asking the user to enter 2fa code for login
    const userEntered2FACode = req.body.twoFactorCode;
  
    // verifing the code entered by the user for 2fa
    const is2FACodeValid = speakeasy.totp.verify({
        secret: user.twoFactorSecret, // Retrieve the user's secret key from the database
        encoding: 'base32',
        token: userEntered2FACode,
    });
    if (!is2FACodeValid) {
        return res.status(401).json({ success: false, message: "Invalid 2FA code" });
    }

  
      // If security questions and 2FA (if enabled) are valid, proceed with login
      const { password, role, ...rest } = user._doc;
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "10d" }
      );

      const expirationDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

      res.cookie("accessToken", token, {
        httpOnly: true,
        expires: expirationDate,
      }).status(200).json({ success: true, message: "Successful login", data: { ...rest } });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to login" });
      console.error(error);
    }
  };
  
  export const initiatePasswordRecovery = async (req, res) => {
    const email = req.body.email;
    const securityQuestion1 = req.body.securityquestion1;
    const securityQuestion2 = req.body.securityquestion2;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Check if security questions match
      if (
        user.securityquestion1 !== securityQuestion1 ||
        user.securityquestion2 !== securityQuestion2
      ) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect security questions',
        });
      }
  
      // Generate a unique token for password reset
      const resetToken = uuidv4();
  
      // Set the reset token and expiration time in the user's record
      user.passwordResetToken = resetToken;
      user.passwordResetTokenExpiry = Date.now() + 3600000; // 1 hour expiration
  
      await user.save();

      const resetPasswordURL = `http://localhost:3000/reset-password/${resetToken}`;

      const transporter = nodemailer.createTransport({
        service: 'Gmail', // Use your email service provider (e.g., 'Gmail', 'Outlook', 'SMTP', etc.)
        auth: {
          user: 'kashigarijanakiram18@gmail.com', // Your email address
          pass: 'cmnl qixs koyw xznp',  // Your email password or an application-specific password
        },
      });

      const mailOptions = {
        from: 'kashigarijanakiram18@gmail.com', // Sender's email address
        to: email, // Recipient's email address
        subject: 'Password Recovery TMS', // Email subject
        text: 'Please use the URL to reset your password'+ ' '+ resetPasswordURL, // Email content in plain text
        // You can also use `html` for sending HTML content.
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email: ', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
         

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to initiate password recovery' });
    }
  };


  export const resetPassword = async (req, res) => {
    const resetToken = req.body.token;
    const newPassword = req.body.newPassword;
  
    try {
      const user = await User.findOne({
        passwordResetToken: resetToken,
      });
  
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
      }
  
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(newPassword, salt);
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiry = undefined;
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: 'Password reset successful',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
  };
  
  