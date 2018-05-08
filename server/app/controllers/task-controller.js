const taskService = require('../services/task-service');
const { Task } = require('../models');
const { TaskSchema } = require('../models/schemas');
const { createUserError } = require('../../utils');

/**
 * Fetch all the tasks from the database.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getAllTasks(req, res) {
    const tasks = await taskService.getAllTasks();

    res.json(tasks);
}

/**
 * Create a task.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function createTask(req, res) {
    const schema = TaskSchema.requiredKeys(
        'name',
        'deadline',
        'state',
        '_embedded', // Prevent not associated tasks
    );

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.message);


    let newTask = new Task({
        ...req.body,
        _embedded: undefined // Remove the only external object
    });

    newTask = await taskService.createTask(newTask, req.body._embedded);

    res.json(newTask);
}


/**
 * Get a task by its id.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function getTaskById(req, res) {
    const taskId = req.params.id;

    const task = await taskService.getTaskById(taskId);

    res.json(task);
}


/**
 * Update a task.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function updateTask(req, res) {
    const schema = TaskSchema.min(1);

    const { error } = schema.validate(req.body);
    if (error) throw createUserError('BadRequest', error.message);

    let newTask = new Task({
        ...req.body,
        _embedded: undefined // Remove the only external object
    });

    const taskId = req.params.id;

    newTask = await taskService.updateTask(taskId, newTask, req.body._embedded);

    res.json(newTask);
}

/**
 * Delete a task.
 *
 * @param req Request
 * @param res Response
 * @return {Promise.<void>} Nothing
 */
async function deleteTask(req, res) {
    const taskId = req.params.id;

    const task = await taskService.deleteTask(taskId);

    res.json(task);
}

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    getTaskById,
    deleteTask,
};
