// controllers/eventController.js
const eventService = require('../services/eventService');

const create = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body, req.user.id);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

const get = async (req, res, next) => {
  try {
    const event = await eventService.getEvent(req.params.id);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body, req.user.id);
    res.json(event);
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const result = await eventService.deleteEvent(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  get,
  update,
  delete: deleteEvent // 'delete' is a reserved word
};