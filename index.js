import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import CreateUserRouter from "./routes/user.js";
import AuthRouter from "./routes/auth.js";
import searchRouter from "./routes/search.js";
import placeRouter from "./routes/places.js";
import accRouter from "./routes/accommodations.js";
import accIDRouter from "./routes/getAccomodationById.js";
import { v4 as uuidv4 } from "uuid";
import travelmodeRouter from "./routes/travelmode.js";
import getUserIt from "./routes/user_itinerary.js";
import travel_itinerarySchema from "./models/travel_itinerary.js";
import accommodation_itinerarySchema from "./models/accomodation_itinerary.js";
import CombinedResults from "./models/combined_results.js";
import accommodations from "./models/accommodations.js";
import reviewRouter from "./routes/getReviewsAccommodation.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const allowedOrigins = ['http://localhost:3000']; // Remove the trailing slash

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

//connecting to database

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo Connected");
  } catch {
    console.log("Could not connect!");
  }
};

//middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/auth", AuthRouter);
app.use("/user", CreateUserRouter);
app.use("/search", searchRouter);
app.use("/search-place", placeRouter);
app.use("/search-mode", travelmodeRouter);
app.use("/search-accommodation", accRouter);
app.use("/api", getUserIt);

app.use("/get-accommodation-by-id", accIDRouter);
app.use("/fetch-useritinerary", getUserIt);
app.use("/fetch-reviews-accommodation", reviewRouter);
// app.use("/add-travelitinerary", Travel_Itinerary);
app.post("/add-travelitinerary", async (req, res) => {
  try {
    const travelData = req.body;
    const newTravelItinerary = new travel_itinerarySchema(travelData);
    const savedTravelItinerary = await newTravelItinerary.save();
    res.status(201).json(savedTravelItinerary);
  } catch (error) {
    console.error("Error creating travel itinerary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/add-accomodationitinerary", async (req, res) => {
  try {
    const accData = req.body;
    const newAccItinerary = new accommodation_itinerarySchema(accData);
    const savedAccItinerary = await newAccItinerary.save();
    res.status(201).json(savedAccItinerary);
  } catch (error) {
    console.error("Error creating accomodation itinerary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/add-comment-itinerary", async (req, res) => {
  try {
    const { uid_user, comment } = req.body;
    const combinedResults = await CombinedResults.findOne({ uid_user });
    console.log(comment);
    if (!combinedResults) {
      return res.status(404).json({ error: "User not found" });
    }
    combinedResults.comments.push(comment);
    await combinedResults.save();

    res.json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// app.post("/add-accomodation-review", async (req, res) => {
//   try {
//     const { accommodation_id, review } = req.body;
//     console.log(accommodation_id);
//     const a = await accommodations.findOne({ _id: accommodation_id });
//     console.log(a);
//     if (!a) {
//       return res.status(404).json({ error: "Accommodation not found" });
//     }
//     a.reviews.push(review);
//     console.log(a);
//     // a.stars.push(rating);
//     await a.save();

//     res.json({ message: "Comment added successfully", a });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });
app.post("/add-accommodation-review", async (req, res) => {
  try {
    const { accommodation_id, review, rating } = req.body;
    console.log(rating, "rating");
    const a = await accommodations.findOne({ _id: accommodation_id });

    if (!a) {
      return res.status(404).json({ error: "Accommodation not found" });
    }
    console.log(a.stars, "stars");
    // Update the totalReviews and averageRating based on the new review
    const newTotalReviews = a.totalReviews + 1;
    console.log(newTotalReviews, "number");
    const newAverageRating =
      ((newTotalReviews - 1) * a.stars + rating) / newTotalReviews;
    console.log(newAverageRating, "new rating");

    // Update accommodation fields
    a.totalReviews = newTotalReviews;
    a.stars = newAverageRating;

    // Add the new review to the reviews array
    a.reviews.push(review);
    // a.rating.push(rating);

    // Save the updated accommodation to the database
    await a.save();

    res.json({ message: "Review added successfully", accommodation: a });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  connect();
  console.log("server listening on port", port);
});
// app.get("/", (req, res) => {
//   res.send("api working");
// });
