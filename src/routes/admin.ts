import express from 'express';
import { checkRole } from '../middleware/auth';
import { User } from '../models/User';
import { Channel } from '../models/Channel';
import { ModerationLog } from '../models/ModerationLog';

const router = express.Router();

// Middleware to ensure only admin and above can access these routes
router.use(checkRole(['Owner', 'Admin']));

// User Management Routes
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Only Owner can change roles
router.put('/users/:id/role', checkRole(['Owner']), async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
    
    await ModerationLog.create({
      action: 'role_change',
      moderator: req.user.username,
      target: { type: 'user', id },
      details: { oldValue: user.role, newValue: role }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Ban user
router.post('/users/:id/ban', async (req, res) => {
  const { reason, duration } = req.body;
  const { id } = req.params;

  try {
    const banUntil = new Date(Date.now() + duration * 1000);
    const user = await User.findByIdAndUpdate(
      id,
      {
        status: 'banned',
        banInfo: {
          reason,
          until: banUntil,
          bannedBy: req.user.username
        }
      },
      { new: true }
    );

    await ModerationLog.create({
      action: 'ban_user',
      moderator: req.user.username,
      target: { type: 'user', id },
      details: { reason, duration }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

// Channel Management Routes
router.get('/channels', async (req, res) => {
  try {
    const channels = await Channel.find({});
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

router.put('/channels/:id', async (req, res) => {
  const { topic, description } = req.body;
  const { id } = req.params;

  try {
    const channel = await Channel.findByIdAndUpdate(
      id,
      { topic, description },
      { new: true }
    );

    await ModerationLog.create({
      action: 'channel_update',
      moderator: req.user.username,
      target: { type: 'channel', id },
      details: { newValue: JSON.stringify({ topic, description }) }
    });

    res.json(channel);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update channel' });
  }
});

// Moderation Logs
router.get('/logs', async (req, res) => {
  try {
    const logs = await ModerationLog.find({})
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch moderation logs' });
  }
});

export default router;
