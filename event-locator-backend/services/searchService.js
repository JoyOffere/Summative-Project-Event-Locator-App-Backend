// services/searchService.js
const { Event, User } = require('../config/database');
const { Op } = require('sequelize');

// Haversine formula to calculate distance between two points
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

class SearchService {
  async searchEvents(userId, { radius = 50, categories = [] }) {
    const user = await User.findByPk(userId);
    if (!user || !user.locationLatitude || !user.locationLongitude) {
      throw new Error('User location not set');
    }

    const events = await Event.findAll({
      where: categories.length > 0 ? {
        categories: { [Op.overlap]: categories }
      } : {}
    });

    return events.filter(event => {
      const distance = getDistance(
        user.locationLatitude,
        user.locationLongitude,
        event.latitude,
        event.longitude
      );
      return distance <= radius;
    });
  }
}

module.exports = new SearchService();