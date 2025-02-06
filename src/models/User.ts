import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: 'Owner' | 'Admin' | 'Moderator' | 'User' | 'Guest';
  status: 'online' | 'offline' | 'banned';
  banInfo?: {
    reason: string;
    until: Date;
    bannedBy: string;
  };
  lastLogin: Date;
  registrationDate: Date;
  lastIP: string;
  sessions: Array<{
    sessionId: string;
    createdAt: Date;
    lastActive: Date;
    ip: string;
  }>;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Owner', 'Admin', 'Moderator', 'User', 'Guest'],
    default: 'User'
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'banned'],
    default: 'offline'
  },
  banInfo: {
    reason: String,
    until: Date,
    bannedBy: String
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastIP: String,
  sessions: [{
    sessionId: String,
    createdAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    ip: String
  }]
});

export const User = model<IUser>('User', UserSchema);
