const redis = require('../config/redis');
const User = require('./models/userModel');
const Event = require('./models/eventModel');

// Handle event notifications
const handleEventNotifications = async (message) => {
  try {
    const notification = JSON.parse(message);
    const { userId, eventId, title, message: notificationMessage } = notification;
    
    console.log(`Processing notification for user ${userId}: ${title}`);
    
    // Here you would typically:
    // 1. Store the notification in the database
    // 2. Send an email/push notification/etc.
    
    // For demonstration purposes, we're just logging
    console.log(`Notification sent: ${notificationMessage}`);
  } catch (error) {
    console.error('Error processing notification:', error);
  }
};

// Schedule upcoming event notifications
const scheduleUpcomingEventNotifications = async () => {
  try {
    // Find events happening in the next 24 hours
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const today = new Date();
    
    const upcomingEvents = await Event.find({
      date: { $gte: today, $lte: tomorrow }
    }).populate('categories');
    
    for (const event of upcomingEvents) {
      // Find users interested in this event's categories
      const users = await User.find({
        preferredCategories: { $in: event.categories.map(c => c._id) }
      });
      
      // Create notifications
      users.forEach(user => {
        const notification = {
          userId: user._id,
          eventId: event._id,
          title: `Upcoming Event: ${event.title}`,
          message: `Reminder: "${event.title}" is happening soon!`,
          date: new Date()
        };
        
        redis.publish('event-notifications', JSON.stringify(notification));
      });
    }
    
    console.log(`Processed ${upcomingEvents.length} upcoming events for notifications`);
  } catch (error) {
    console.error('Error scheduling upcoming event notifications:', error);
  }
};

// Start notification subscription
const startNotificationConsumer = () => {
  // Subscribe to event notifications channel
  const subscriber = redis.subscribe('event-notifications', handleEventNotifications);
  
  // Schedule periodic checking for upcoming events (every hour)
  setInterval(scheduleUpcomingEventNotifications, 60 * 60 * 1000);
  
  return subscriber;
};

module.exports = { startNotificationConsumer };