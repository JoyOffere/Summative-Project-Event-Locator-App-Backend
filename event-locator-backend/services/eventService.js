// services/eventService.js
const { Event } = require('../config/database');
const createError = require('http-errors');
const notificationService = require('./notificationService');

class EventService {
  async createEvent(eventData, userId) {
    return await Event.create({
      ...eventData,
      createdBy: userId
    });// services/eventService.js
    const { Event } = require('../config/database');
    const createError = require('http-errors');
    const notificationService = require('./notificationService');
    
    class EventService {
      async createEvent(eventData, userId) {
        // Create the event
        const event = await Event.create({
          ...eventData,
          createdBy: userId
        });
    
        // Schedule notification for the newly created event
        await notificationService.scheduleNotification(event.id);
    
        return event;
      }
    
      async getEvent(id) {
        const event = await Event.findByPk(id);
        if (!event) throw createError(404, 'Event not found');
        return event;
      }
    
      async updateEvent(id, eventData, userId) {
        const event = await Event.findByPk(id);
        if (!event) throw createError(404, 'Event not found');
        if (event.createdBy !== userId) throw createError(403, 'Unauthorized');
    
        return await event.update(eventData);
      }
    
      async deleteEvent(id, userId) {
        const event = await Event.findByPk(id);
        if (!event) throw createError(404, 'Event not found');
        if (event.createdBy !== userId) throw createError(403, 'Unauthorized');
    
        await event.destroy();
        return { message: 'Event deleted successfully' };
      }
    }
    
    module.exports = new EventService();
  }

  async getEvent(id) {
    const event = await Event.findByPk(id);
    if (!event) throw createError(404, 'Event not found');
    return event;
  }

  async updateEvent(id, eventData, userId) {
    const event = await Event.findByPk(id);
    if (!event) throw createError(404, 'Event not found');
    if (event.createdBy !== userId) throw createError(403, 'Unauthorized');

    return await event.update(eventData);
  }

  async deleteEvent(id, userId) {
    const event = await Event.findByPk(id);
    if (!event) throw createError(404, 'Event not found');
    if (event.createdBy !== userId) throw createError(403, 'Unauthorized');

    await event.destroy();
    return { message: 'Event deleted successfully' };
  }
}

module.exports = new EventService();