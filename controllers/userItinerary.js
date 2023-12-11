import accomodation_itinerary from "../models/accomodation_itinerary.js";
import travel_itinerary from "../models/travel_itinerary.js";
import CombinedResults from "../models/combined_results.js";
import speakeasy from 'speakeasy';
import nodemailer from 'nodemailer'
import User from '../models/User.js';

export const getUserItinerary = async (req, res) => {
  const input = req.query.userId;
  console.log(input, "user_id");

  try {
    let existingCombinedResults = await CombinedResults.findOne({
      uid_user: input,
    });

    // Fetch accommodation and travel itineraries
    const results_acc = await accomodation_itinerary.find({ uid_user: input });
    const results_travel = await travel_itinerary.find({ uid_user: input });

    // Create or update combined results
    if (existingCombinedResults) {
      // If document exists, update it
      existingCombinedResults.accomodation = results_acc;
      existingCombinedResults.travel = results_travel;
      await existingCombinedResults.save();
    } else {
      // If document doesn't exist, create it
      const combinedResults = {
        uid_user: input,
        accomodation: results_acc,
        travel: results_travel,
        comments: [], // You may need to fetch and include existing comments here
      };

      await CombinedResults.create(combinedResults);
    }

    res.json(existingCombinedResults || combinedResults);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

/*
export const sendItineraryEmail = async (req, res) => {
  const { uid_user, from_place, departure_date, return_date, num_travelers } = req.body;

  try {
    const user = await User.findOne({ _id: uid_user });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    console.log(`Sending email to user: ${uid_user}`);
    console.log(user);
    const to_email = user.email
    const mailOptions = {
      from: 'kashigarijanakiram18@gmail.com', // Sender's email address
      to: to_email, // Recipient's email address
      subject: 'Travel Itinerary Details', // Email subject
      text: `Please find your itinerary details:
      Departure Place: ${req.body.from_place}
      Departure Date: ${req.body.departure_date}
      Return Date: ${req.body.return_date}
      Number of Travelers: ${req.body.num_travelers}`, // Email content in plain text
      // You can also use `html` for sending HTML content.
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email: ', error);
        return res.status(500).json({ error: 'Error sending email' });
      }
      console.log('Email sent: ' + info.response);
      res.json({ message: "Email sent successfully" });
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
*/
export const sendItineraryEmail = async (req, res) => {
  const { uid_user, recipientEmail } = req.body;

  try {
    // Fetch the user's details
    const user = await User.findOne({ _id: uid_user });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use the user's email if recipientEmail is not provided
    const to_email = recipientEmail || user.email;

    // Fetch the user itinerary details
    const existingCombinedResults = await CombinedResults.findOne({ uid_user });
    if (!existingCombinedResults) {
      return res.status(404).json({ error: "Itinerary not found" });
    }

    // Format the email content
    let accommodationsText = 'Accommodations:\n';
    existingCombinedResults.accomodation.forEach((item, index) => {
      accommodationsText += `Location ${index + 1} - Check-in: ${item.checkin_date}, Check-out: ${item.checkout_date}, Number of Travelers: ${item.num_travelers}\n`;
    });

    let travelText = 'Travel Services:\n';
    existingCombinedResults.travel.forEach((item, index) => {
      travelText += `Service ${index + 1} - From: ${item.from_place}, Departure: ${item.departure_date}, Return: ${item.return_date}, Number of Travelers: ${item.num_travelers}\n`;
    });

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'kashigarijanakiram18@gmail.com',
        pass: 'cmnl qixs koyw xznp',
      },
    });

    // Define email contents
    const mailOptions = {
      from: 'kashigarijanakiram18@gmail.com',
      to: to_email,
      subject: 'Travel Itinerary Details',
      text: `${accommodationsText}\n${travelText}\nComments:\n${existingCombinedResults.comments.join('\n')}`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email: ', error);
        return res.status(500).json({ error: 'Error sending email' });
      }
      console.log('Email sent: ' + info.response);
      res.json({ message: "Email sent successfully" });
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};