const { Event, User } = require('../config/database');
const { Op } = require('sequelize');

class NotificationService {
  constructor() {
    console.log('ℹ️ Running in no-Redis mode (notifications will be logged only)');
    this.publish = this.mockPublish;
    this.subscribe = this.mockSubscribe;
  }

  async mockPublish(channel, message) {
    console.log(`[Mock Redis] Would publish to ${channel}:`, message);
    return true;
  }

  async mockSubscribe(channel, callback) {
    console.log(`[Mock Redis] Would subscribe to ${channel}`);
    return true;
  }

  async scheduleNotification(eventId) {
    const event = await Event.findByPk(eventId);
    if (!event) return;

    const users = await User.findAll({
      where: {
        preferredCategories: { [Op.overlap]: event.categories }
      }
    });

    const notification = {
      eventId: event.id,
      title: event.title,
      dateTime: event.dateTime,
      users: users.map(u => u.id)
    };

    console.log('[Mock Notification] Would notify users:', notification.users);
    // In a real implementation, you'd send emails/push notifications here
  }

  async startListening() {
    console.log('ℹ️ Notification service running in mock mode');
    return true;
  }
}

module.exports = new NotificationService();