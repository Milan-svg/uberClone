import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";
dotenv.config();

async function testOperations() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    // In your test script
    const user1 = await User.findOne({ name: "john_dev" });
    const user2 = await User.findOne({ name: "john_dev2" }); // Create this user first

    // Now implement the 4 updates needed for user1 to follow user2
    // HINT: You might need User.updateOne() or User.findByIdAndUpdate()
    //user2 gets user1's id in its follower array
    await User.findByIdAndUpdate(user2._id, {
      $push: { followers: user1._id },
      $inc: { followerCount: 1 },
    });

    //add user2's id to user1's following arr
    await User.findByIdAndUpdate(user1._id, {
      $push: { following: user2._id },
      $inc: { followingCount: 1 },
    });
    console.log(`${user1.name} now follows ${user2.name}!`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

testOperations();

// //// Advanced: Update both users in one atomic operation
// await User.bulkWrite([
//   {
//     updateOne: {
//       filter: { _id: user2._id },
//       update: {
//         $push: { followers: user1._id },
//         $inc: { followerCount: 1 }
//       }
//     }
//   },
//   {
//     updateOne: {
//       filter: { _id: user1._id },
//       update: {
//         $push: { following: user2._id },
//         $inc: { followingCount: 1 }
//       }
//     }
//   }
// ]);
