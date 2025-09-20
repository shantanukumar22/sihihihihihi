import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  officialName: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  securityQuestion: string;
  securityAnswer: string;
  phoneNumber: string;
  profileComplete: boolean;
  digilockerVerified: boolean;
  digilockerVerificationCode: string;
  digilockerVerifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  officialName: {
    type: String,
    required: [true, 'Official full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  dateOfBirth: {
    type: Date,
    required: false,
    validate: {
      validator: function(this: IUser, value: Date) {
        if (!value) return true; // Allow empty during signup
        const today = new Date();
        const age = today.getFullYear() - value.getFullYear();
        return age >= 18;
      },
      message: 'You must be at least 18 years old to use this service'
    }
  },
  securityQuestion: {
    type: String,
    required: false,
    trim: true
  },
  securityAnswer: {
    type: String,
    required: false,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: false,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number']
  },
  profileComplete: {
    type: Boolean,
    default: false
  },
  digilockerVerified: {
    type: Boolean,
    default: false
  },
  digilockerVerificationCode: {
    type: String,
    required: false,
    trim: true
  },
  digilockerVerifiedAt: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Create indexes
UserSchema.index({ createdAt: -1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
