import { Document, Schema, model } from 'mongoose';

export interface IChannel extends Document {
  name: string;
  type: 'announcements' | 'general' | 'links' | 'admin';
  description: string;
  topic?: string;
  allowedRoles: Array<string>;
  postingRoles: Array<string>;
  createdAt: Date;
  isDefault: boolean;
}

const ChannelSchema = new Schema<IChannel>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['announcements', 'general', 'links', 'admin'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  topic: String,
  allowedRoles: [{
    type: String,
    enum: ['Owner', 'Admin', 'Moderator', 'User', 'Guest']
  }],
  postingRoles: [{
    type: String,
    enum: ['Owner', 'Admin', 'Moderator', 'User', 'Guest']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

export const Channel = model<IChannel>('Channel', ChannelSchema);
