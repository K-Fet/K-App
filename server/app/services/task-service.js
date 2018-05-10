const logger = require('../../logger');
const { Barman, Kommission, Task } = require('../models');
const { createUserError, createServerError, cleanObject, setEmbeddedAssociations } = require('../../utils');
const sequelize = require('../../db');

/**
 * Create a task.
 *
 * @param newTask {Task} partial task
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<Task|Errors.ValidationError>} The created task with its id
 */
async function createTask(newTask, _embedded) {

    logger.verbose('Task service: creating a new task named %s', newTask.name);

    const transaction = await sequelize.transaction();
    try {
        newTask.kommissionId = _embedded.kommissionId;
        delete _embedded.kommissionId;
        await newTask.save({ transaction });
    } catch (err) {
        logger.warn('Task service: Error while creating task', err);
        await transaction.rollback();
        throw createServerError('ServerError', 'Error while creating task');
    }

    //Associations
    if (_embedded) {
        for (const associationKey of Object.keys(_embedded)) {
            const value = _embedded[associationKey];

            await setEmbeddedAssociations(associationKey, value, newTask, transaction, true);
        }
    }

    await transaction.commit();
    return newTask.reload({
        include: [
            {
                model: Barman,
                as: 'barmen'
            },
            {
                model: Kommission,
                as: 'kommission'
            }
        ]
    });
}


/**
 * Get a task by its id.
 *
 * @param taskId {number} Task id
 * @return {Promise<Task>} The wanted task.
 */
async function getTaskById(taskId) {

    logger.verbose('Task service: get task by id %d', taskId);

    const task = await Task.findById(taskId, {
        include: [
            {
                model: Barman,
                as: 'barmen'
            },
            {
                model: Kommission,
                as: 'kommission'
            }
        ]
    });


    if (!task) throw createUserError('UnknownTask', 'This task does not exist');

    return task;
}


/**
 * Update an task.
 * This will copy only the allowed changes from the `updatedTask`
 * into the current task.
 * This means, with this function, you can not change everything like
 * the `createdAt` field or others.
 *
 * @param taskId {number} Task id
 * @param updatedTask {Task} Updated task, constructed from the request.
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<Task>} The updated task
 */
async function updateTask(taskId, updatedTask, _embedded) {

    const currentTask = await Task.findById(taskId);

    if (!currentTask) throw createUserError('UnknownTask', 'This task does not exist');

    logger.verbose('Task service: updating task named %s %s', currentTask.id, currentTask.name);

    const transaction = await sequelize.transaction();

    try {

        await currentTask.update(cleanObject({
            name: updatedTask.name,
            description: updatedTask.description,
            deadline: updatedTask.deadline,
            state: updatedTask.state,
            kommissionId: _embedded ? _embedded.kommissionId : undefined,
        }), { transaction });
        if (_embedded && _embedded.kommissionId) delete _embedded.kommissionId;
    } catch (err) {
        logger.warn('Task Service : error while updating a task', err);
        await transaction.rollback();
        throw createServerError('Server Error', 'Error while updating a task');
    }

    //Associations

    if (_embedded) {
        for (const associationKey of Object.keys(_embedded)) {

            const value = _embedded[associationKey];

            await setEmbeddedAssociations(associationKey, value, currentTask, transaction);
        }
    }

    await transaction.commit();
    await currentTask.reload({
        include: [
            {
                model: Barman,
                as: 'barmen'
            },
            {
                model: Kommission,
                as: 'kommission'
            }
        ]
    });
    return currentTask;
}

/**
 * Delete an task.
 *
 * @param taskId {number} task id.
 * @return {Promise<Task>} The deleted task
 */
async function deleteTask(taskId) {

    logger.verbose('Task service: deleting task with id %d', taskId);

    const task = await Task.findById(taskId);

    if (!task) throw createUserError('UnknownTask', 'This task does not exist');

    await task.destroy();

    return task;
}


module.exports = {
    createTask,
    updateTask,
    getTaskById,
    deleteTask,
};
