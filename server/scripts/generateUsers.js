import mongoose from "mongoose";
import { User } from "../models/user.model.js";
async function generateUsers(count = 50) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const userSkills = getRandomElements(developerSkills, 2, 5);
    const user = {
      name: `dev_user_${i + 1}`,
      email: `user${i + 1}@devconnect.com`,
      password: "hashedPassword123", // In real app, this would be bcrypt hashed
      bio: sampleBios[i % sampleBios.length],
      skills: userSkills,
      location: getRandomLocation(),
      joinDate: getRandomDateInRange(30), // Random date within last 30 days
      followers: [], // We'll populate this in step 2
      following: [],
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
    };

    users.push(user);
  }
  return await User.insertMany(users);
}

function getRandomElements(arr, min, max) {
  const count = Math.floor(Math.random() * (max - min + 1) + min);
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
// Helper function - get random location
function getRandomLocation() {
  const locations = [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Toronto, ON",
    "London, UK",
    "Berlin, Germany",
    "Bangalore, India",
    "Tokyo, Japan",
    "Sydney, Australia",
    "Remote",
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

// Helper function - get random date within range
function getRandomDateInRange(daysBack) {
  const now = new Date();
  const msPerDay = 24 * 60 * 60 * 1000;
  const randomDaysAgo = Math.floor(Math.random() * daysBack);
  return new Date(now - randomDaysAgo * msPerDay);
}

const developerSkills = [
  "javascript",
  "react",
  "node.js",
  "python",
  "mongodb",
  "express",
  "vue",
  "angular",
  "typescript",
  "aws",
  "docker",
  "kubernetes",
  "graphql",
  "redis",
  "postgresql",
];

const sampleBios = [
  "Full-stack developer passionate about clean code and user experience",
  "Frontend specialist with React and Vue expertise",
  "Backend engineer focusing on scalable architectures",
  "DevOps enthusiast automating everything",
  "Mobile developer building the future one app at a time",
];

const postTemplates = [
  "Just shipped a new feature using {skill}! The performance improvements are incredible 🚀",
  "Working on a side project with {skill} and {skill}. Learning so much!",
  "Hot take: {skill} is underrated in the current tech landscape",
  "Code review tip: Always consider {skill} when designing APIs",
  "Debugging a tricky {skill} issue. Any experts in the house?",
];
