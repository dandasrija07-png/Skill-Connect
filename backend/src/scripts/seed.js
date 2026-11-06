import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

import { User } from "../models/User.js";
import { Skill } from "../models/Skill.js";
import { LearningRequest } from "../models/LearningRequest.js";
import { ExchangeRequest } from "../models/ExchangeRequest.js";
import { Session } from "../models/Session.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { Notification } from "../models/Notification.js";
import { Review } from "../models/Review.js";
import { Progress } from "../models/Progress.js";
import { Wishlist } from "../models/Wishlist.js";

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI is not defined in backend/.env");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoURI);
    console.log("Connected successfully. Clearing existing collections...");

    await Promise.all([
      User.deleteMany({}),
      Skill.deleteMany({}),
      LearningRequest.deleteMany({}),
      ExchangeRequest.deleteMany({}),
      Session.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Review.deleteMany({}),
      Progress.deleteMany({}),
      Wishlist.deleteMany({})
    ]);

    console.log("Collections cleared. Seeding initial users...");

    const hashedPassword = await bcrypt.hash("Password123!", 10);

    const initialUsers = [
      {
        fullName: "Priya Sharma",
        username: "priyacodes",
        email: "priya.sharma@example.com",
        password: hashedPassword,
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&h=240&fit=crop&crop=faces",
        bio: "Senior Frontend Engineer & UI Specialist. Passionate about building responsive web apps with React and Tailwind CSS. Excited to exchange for UI/UX Design and Spanish!",
        location: "Bengaluru, India",
        skillsToTeach: ["React.js", "Tailwind CSS", "JavaScript ES6+", "Web Development"],
        skillsToLearn: ["UI/UX Design", "Spanish", "Graphic Design"],
        experienceLevel: "advanced",
        preferredLearningMethod: "online",
        availability: "Evenings & Weekends",
        averageRating: 4.9,
        totalReviews: 38,
        hoursTaught: 120,
        hoursLearned: 45,
        isEmailVerified: true
      },
      {
        fullName: "Alex Chen",
        username: "alexux",
        email: "alex.chen@example.com",
        password: hashedPassword,
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop&crop=faces",
        bio: "Product designer with 6+ years designing SaaS platforms and mobile apps in Figma. Keen to master React and Python to build my own design engineering projects.",
        location: "San Francisco, USA",
        skillsToTeach: ["UI/UX Design", "Figma", "Design Systems", "Prototyping"],
        skillsToLearn: ["React.js", "Python", "Mobile App Development"],
        experienceLevel: "advanced",
        preferredLearningMethod: "online",
        availability: "Flexible Weekdays",
        averageRating: 4.8,
        totalReviews: 29,
        hoursTaught: 94,
        hoursLearned: 30,
        isEmailVerified: true
      },
      {
        fullName: "Rohan Patel",
        username: "rohanp_dev",
        email: "rohan.patel@example.com",
        password: hashedPassword,
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=faces",
        bio: "Backend developer specializing in Python, Django, and PostgreSQL. Excited to exchange backend logic for UI design and conversational German.",
        location: "Mumbai, India",
        skillsToTeach: ["Python", "Django", "FastAPI", "Database Design"],
        skillsToLearn: ["UI/UX Design", "Figma", "German"],
        experienceLevel: "advanced",
        preferredLearningMethod: "online",
        availability: "Saturdays & Sundays",
        averageRating: 4.9,
        totalReviews: 42,
        hoursTaught: 140,
        hoursLearned: 60,
        isEmailVerified: true
      },
      {
        fullName: "Elena Rostova",
        username: "elenalingo",
        email: "elena.rostova@example.com",
        password: hashedPassword,
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=faces",
        bio: "Polyglot and certified Spanish & French instructor. Love helping beginners gain conversational fluency. Looking to learn photography and digital illustration.",
        location: "Barcelona, Spain",
        skillsToTeach: ["Spanish", "French", "Conversational English"],
        skillsToLearn: ["Photography", "Digital Illustration", "Web Development"],
        experienceLevel: "intermediate",
        preferredLearningMethod: "online",
        availability: "Morning Slots",
        averageRating: 4.95,
        totalReviews: 54,
        hoursTaught: 180,
        hoursLearned: 20,
        isEmailVerified: true
      },
      {
        fullName: "Marcus Vance",
        username: "marcusv",
        email: "marcus.vance@example.com",
        password: hashedPassword,
        profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&h=240&fit=crop&crop=faces",
        bio: "Commercial photographer & videographer with 10 years experience. Eager to learn Python for data analysis and automate my media workflows.",
        location: "London, UK",
        skillsToTeach: ["Photography", "Adobe Lightroom", "Video Editing", "Cinematography"],
        skillsToLearn: ["Python", "Automation", "SEO"],
        experienceLevel: "advanced",
        preferredLearningMethod: "hybrid",
        availability: "Weekends Only",
        averageRating: 4.85,
        totalReviews: 31,
        hoursTaught: 110,
        hoursLearned: 40,
        isEmailVerified: true
      }
    ];

    const createdUsers = await User.insertMany(initialUsers);
    console.log(`Created ${createdUsers.length} users.`);

    const [priya, alex, rohan, elena, marcus] = createdUsers;

    console.log("Seeding skills...");
    const skillsData = [
      {
        teacher: priya._id,
        title: "Modern React.js from Scratch to Production",
        category: "Programming & Development",
        description: "Master React fundamentals, component design, hooks (useState, useEffect, custom hooks), Context API, and state management by building real-world projects.",
        level: "beginner",
        format: "one-on-one",
        exchangeType: "both",
        rating: 4.9,
        reviewCount: 38,
        tags: ["React", "JavaScript", "Frontend", "Web Dev"],
        status: "active",
        learningOutcomes: [
          "Understand React component lifecycle and virtual DOM",
          "Build custom hooks for reusable logic",
          "Manage global application state using Context API",
          "Deploy responsive React apps to Vercel and Netlify"
        ],
        syllabus: [
          { week: 1, title: "Modern JavaScript (ES6+) Refresher" },
          { week: 2, title: "React Core Concepts & JSX" },
          { week: 3, title: "Hooks Deep Dive (useState, useEffect)" },
          { week: 4, title: "Building a Full Project & Deployment" }
        ]
      },
      {
        teacher: alex._id,
        title: "UI/UX Design Systems in Figma",
        category: "Design & Creative",
        description: "Learn to design production-grade UI components, interactive prototypes, auto-layouts, tokens, and comprehensive Figma design systems.",
        level: "intermediate",
        format: "one-on-one",
        exchangeType: "both",
        rating: 4.85,
        reviewCount: 29,
        tags: ["Figma", "UI/UX", "Design System", "Wireframing"],
        status: "active",
        learningOutcomes: [
          "Create scalable Figma component libraries",
          "Master Auto Layout and responsive constraints",
          "Design high-fidelity interactive prototypes",
          "Hand off specs seamlessly to frontend engineers"
        ],
        syllabus: [
          { week: 1, title: "Typography, Color Scales & Tokens" },
          { week: 2, title: "Auto Layout & Component Variants" },
          { week: 3, title: "Prototyping Complex Micro-interactions" },
          { week: 4, title: "Publishing and Maintaining Design Systems" }
        ]
      },
      {
        teacher: rohan._id,
        title: "Practical Python for Automation & Backends",
        category: "Programming & Development",
        description: "Zero to hero Python programming focusing on data structures, web scraping, REST APIs with FastAPI, and automated scripting.",
        level: "beginner",
        format: "one-on-one",
        exchangeType: "both",
        rating: 4.95,
        reviewCount: 42,
        tags: ["Python", "FastAPI", "Backend", "Scripting"],
        status: "active",
        learningOutcomes: [
          "Write clean, idiomatic Python code",
          "Build web scrapers with BeautifulSoup",
          "Develop REST APIs using FastAPI and Pydantic",
          "Work with SQLite and PostgreSQL databases"
        ],
        syllabus: [
          { week: 1, title: "Python Syntax, Data Structures & Logic" },
          { week: 2, title: "File I/O and Web Automation Scripts" },
          { week: 3, title: "Building APIs with FastAPI" },
          { week: 4, title: "Database Integration & Testing" }
        ]
      },
      {
        teacher: elena._id,
        title: "Conversational Spanish for Real-Life Situations",
        category: "Languages",
        description: "Gain confidence speaking Spanish from day one with structured conversational roleplays, everyday idioms, and practical grammar.",
        level: "all_levels",
        format: "one-on-one",
        exchangeType: "both",
        rating: 4.95,
        reviewCount: 54,
        tags: ["Spanish", "Language", "Conversation", "Grammar"],
        status: "active",
        learningOutcomes: [
          "Speak Spanish comfortably in restaurants, travel, and social events",
          "Master essential verb tenses (Present, Past, Future)",
          "Overcome fear of speaking with native pronunciation drills"
        ],
        syllabus: [
          { week: 1, title: "Pronunciation & Daily Greetings" },
          { week: 2, title: "Travel, Dining & Everyday Scenarios" },
          { week: 3, title: "Past Tense & Storytelling" },
          { week: 4, title: "Cultural Idioms and Natural Flow" }
        ]
      },
      {
        teacher: marcus._id,
        title: "Mastering Manual Photography & Lightroom",
        category: "Photography & Video",
        description: "Understand the exposure triangle (ISO, Aperture, Shutter Speed), composition rules, and professional color grading in Adobe Lightroom.",
        level: "beginner",
        format: "one-on-one",
        exchangeType: "both",
        rating: 4.8,
        reviewCount: 31,
        tags: ["Photography", "Lightroom", "Color Grading", "Camera"],
        status: "active",
        learningOutcomes: [
          "Shoot with 100% manual camera controls",
          "Understand lighting and natural shadows",
          "Color grade raw images professionally in Lightroom"
        ],
        syllabus: [
          { week: 1, title: "The Exposure Triangle & Camera Anatomy" },
          { week: 2, title: "Lenses, Framing & Creative Composition" },
          { week: 3, title: "RAW Processing in Adobe Lightroom" },
          { week: 4, title: "Color Grading & Export Workflows" }
        ]
      }
    ];

    const createdSkills = await Skill.insertMany(skillsData);
    console.log(`Created ${createdSkills.length} skills.`);

    const [reactSkill, figmaSkill, pythonSkill, spanishSkill, photoSkill] = createdSkills;

    console.log("Seeding sample learning and exchange requests...");

    // Alex wants to learn React from Priya
    const req1 = await LearningRequest.create({
      learner: alex._id,
      teacher: priya._id,
      skill: reactSkill._id,
      status: "accepted",
      message: "Hi Priya! I'm a product designer and would love to learn React to bridge the gap with developers.",
      preferredSchedule: "Tuesdays & Thursdays, 7 PM IST"
    });

    // Priya and Alex initiate a skill exchange (React <-> Figma)
    const ex1 = await ExchangeRequest.create({
      sender: priya._id,
      recipient: alex._id,
      offeredSkill: reactSkill._id,
      requestedSkill: figmaSkill._id,
      status: "accepted",
      message: "Hey Alex! Let's do a mutual exchange: I'll teach you React and you help me refine Figma design systems!",
      frequency: "weekly"
    });

    console.log("Seeding sample sessions...");
    const upcomingDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days ahead
    const s1 = await Session.create({
      teacher: priya._id,
      learner: alex._id,
      skill: reactSkill._id,
      learningRequest: req1._id,
      exchangeRequest: ex1._id,
      title: "React Component Architecture & Props",
      description: "Covering JSX, passing props, destructuring, and building our first reusable Card component.",
      scheduledAt: upcomingDate,
      duration: 60,
      status: "scheduled",
      meetingLink: "https://meet.skillconnect.app/room-react-figma-101",
      sessionType: "exchange",
      agenda: [
        "Review JavaScript ES6 destructuring",
        "Build Header, Button, and Card components",
        "Live coding exercise: Props and Children"
      ]
    });

    const pastDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const s2 = await Session.create({
      teacher: priya._id,
      learner: alex._id,
      skill: reactSkill._id,
      title: "Introduction to React & Virtual DOM",
      description: "First session covering environment setup with Vite and basic JSX.",
      scheduledAt: pastDate,
      duration: 60,
      status: "completed",
      meetingLink: "https://meet.skillconnect.app/room-react-intro",
      sessionType: "exchange"
    });

    console.log("Seeding reviews...");
    await Review.create({
      reviewer: alex._id,
      teacher: priya._id,
      skill: reactSkill._id,
      session: s2._id,
      rating: 5,
      comment: "Priya is an incredible teacher! She explained React components and hooks in a way that clicked for a designer like me. Highly recommend!",
      teacherResponse: "Thank you so much Alex! You made great progress on your first component library."
    });

    console.log("Seeding conversations and messages...");
    const conv = await Conversation.create({
      participants: [priya._id, alex._id],
      lastMessage: "Looking forward to our upcoming React session this Thursday!",
      lastMessageAt: new Date()
    });

    await Message.create({
      conversation: conv._id,
      sender: alex._id,
      receiver: priya._id,
      content: "Hi Priya! I set up my Vite React environment as you recommended. It works like a charm!"
    });

    await Message.create({
      conversation: conv._id,
      sender: priya._id,
      receiver: alex._id,
      content: "Awesome Alex! Looking forward to our upcoming React session this Thursday!"
    });

    console.log("Seeding notifications...");
    await Notification.create({
      recipient: priya._id,
      sender: alex._id,
      type: "session_scheduled",
      title: "Upcoming Session Confirmed",
      message: "Your exchange session with Alex Chen is set for this Thursday at 7:00 PM.",
      link: "/sessions"
    });

    console.log("Seeding learning progress tracker...");
    await Progress.create({
      user: alex._id,
      skill: reactSkill._id,
      teacher: priya._id,
      skillTitle: "Modern React.js from Scratch to Production",
      totalSessions: 6,
      completedSessions: 1,
      learningHours: 2,
      progressPercentage: 20,
      milestones: [
        { title: "Vite Environment Setup & JSX", completed: true, completedAt: pastDate },
        { title: "Component Props & State Management", completed: false },
        { title: "useEffect Hook & API Fetching", completed: false },
        { title: "Custom Hooks & Context API", completed: false },
        { title: "Final Portfolio Project Deployment", completed: false }
      ],
      goals: [
        { text: "Build a personal portfolio in React", completed: false },
        { text: "Publish a custom UI component to npm", completed: false }
      ],
      notes: "Completed first milestone. Alex grasped props very quickly."
    });

    console.log("==================================================");
    console.log("🎉 Database seeding completed successfully!");
    console.log("Demo credentials:");
    console.log("  Email: priya.sharma@example.com (or alex.chen@example.com, rohan.patel@example.com)");
    console.log("  Password: Password123!");
    console.log("==================================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed with error:", error);
    process.exit(1);
  }
};

seedData();
