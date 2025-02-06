import { Document, Schema, model } from 'mongoose';

export interface IModerationLog extends Document {
  action: 'delete_message' | 'ban_user' | 'unban_user' | 'mute_user' | 'role_change' | 'channel_update';
  moderator: string;
  target: {
    type: 'user' | 'message' | 'channel';
    id: string;
  };
  details: {
    reason?: string;
    duration?: number;
    oldValue?: string;
    newValue?: string;
    metadata?: Record<string, any>;
  };
  timestamp: Date;
}

const ModerationLogSchema = new Schema<IModerationLog>({
  action: {
    type: String,
    required: true,
    enum: ['delete_message', 'ban_user', 'unban_user', 'mute_user', 'role_change', 'channel_update']
  },
  moderator: {
    type: String,
    required: true
  },
  target: {
    type: {
      type: String,
      required: true,
      enum: ['user', 'message', 'channel']
    },
    id: {
      type: String,
      required: true
    }
  },
  details: {
    reason: String,
    duration: Number,
    oldValue: String,
    newValue: String,
    metadata: Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const ModerationLog = model<IModerationLog>('ModerationLog', ModerationLogSchema);
