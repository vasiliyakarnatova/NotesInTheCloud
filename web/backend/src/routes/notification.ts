import express from 'express';
import {
  createNotification,
  updateNotification,
  deleteNotification,
  getNotification,
  getNotificationsFromUser
} from '../../../db/services/notificationService';

const router = express.Router();

router.post('/:reminderId', async (req, res) => {
  try {
    const notif = await createNotification(req.params.reminderId);
    res.status(201).json(notif);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const updated = await updateNotification(req.params.id, req.body.isRead);
  res.json(updated);
});

router.get('/:id', async (req, res) => {
  const notif = await getNotification(req.params.id);
  res.json(notif);
});

router.get('/user/:username', async (req, res) => {
  const notifs = await getNotificationsFromUser(req.params.username);
  res.json(notifs);
});

router.delete('/:id', async (req, res) => {
  await deleteNotification(req.params.id);
  res.status(204).end();
});

export default router;