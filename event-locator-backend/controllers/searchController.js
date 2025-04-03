// controllers/searchController.js
const searchService = require('../services/searchService');

class SearchController {
  async search(req, res, next) {
    try {
      const { radius, categories } = req.query;
      const events = await searchService.searchEvents(req.user.id, {
        radius: radius ? parseFloat(radius) : undefined,
        categories: categories ? categories.split(',') : []
      });
      res.json(events);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SearchController();