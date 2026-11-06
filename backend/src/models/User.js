import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"]
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [40, "Username cannot exceed 40 characters"],
      index: true
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
      index: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false // Never return password hash in queries by default
    },
    profileImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&h=240&fit=crop&crop=faces"
    },
    headline: {
      type: String,
      trim: true,
      default: "Passionate SkillConnect Member"
    },
    location: {
      type: String,
      trim: true,
      default: "Remote / Global"
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
      default: "Enthusiastic about sharing what I know and learning new passions."
    },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "Intermediate"
    },
    skillsToTeach: {
      type: [String],
      default: [],
      index: true
    },
    skillsToLearn: {
      type: [String],
      default: [],
      index: true
    },
    interests: {
      type: [String],
      default: []
    },
    preferredLearningMethod: {
      type: String,
      enum: ["Online (Video Call)", "In-Person", "Hybrid", "Flexible"],
      default: "Online (Video Call)"
    },
    availability: {
      type: String,
      default: "Flexible Evenings"
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
      default: "active"
    },
    isEmailVerified: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    hoursTaught: {
      type: Number,
      default: 0
    },
    hoursLearned: {
      type: Number,
      default: 0
    },
    badges: {
      type: [String],
      default: ["New Member"]
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Text index for search
userSchema.index({ fullName: "text", username: "text", headline: "text", skillsToTeach: "text", skillsToLearn: "text" });

export const User = mongoose.model("User", userSchema);

