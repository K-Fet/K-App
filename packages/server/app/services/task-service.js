const logger = require('../../logger');
const { Barman, Kommission, Task } = require('../models');
const {
  createUserError, createServerError, cleanObject, setAssociations,
} = require('../../utils');
const { sequelize } = require('../../bootstrap/sequelize');

/**
 * Create a task.
 *
 * @param newTask {Task} partial task
 * @param _embedded {Object} Object containing associations to update, see swagger for more information.
 * @return {Promise<Task|Errors.ValidationError>} The created task with its id
 */
async function createTask(newTask, _embedded) {
  logger.verbose('Task service: creating a new task named %s', newTask.name);

  if (!await Kommission.findByPk(_embedded.kommissionId)) throw createUserError('UnknownKommission', 'This kommission does not exist');

  const transaction = await sequelize().transaction();
  try {
    // eslint-disable-next-line no-param-reassign
    newTask.kommissionId = _embedded.kommissionId;
    // eslint-disable-next-line no-param-reassign
    delete _embedded.kommissionId;
    await newTask.save({ transaction });
  } catch (err) {
    logger.warn('Task service: Error while creating task', err);
    await transaction.rollback();
    throw createServerError('ServerError', 'Error while creating task');
  }

  // Associations
  await setAssociations(_embedded, newTask, null, transaction, true);

  await transaction.commit();
  return newTask.reload({
    include: [
      {
        model: Barman,
        as: 'barmen',
      },
      {
        model: Kommission,
        as: 'kommission',
      },
    ],
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

  const task = await Task.findByPk(taskId, {
    include: [
      {
        model: Barman,
        as: 'barmen',
      },
      {
        model: Kommission,
        as: 'kommission',
      },
    ],
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
 * @param _embedded {Object} Embedded object
 * @return {Promise<Task>} The updated task
 */
async function updateTask(taskId, updatedTask, _embedded) {
  const currentTask = await Task.findByPk(taskId);

  if (!currentTask) throw createUserError('UnknownTask', 'This task does not exist');

  logger.verbose('Task service: updating task named %s %s', currentTask.id, currentTask.name);

  const transaction = await sequelize().transaction();

  try {
    await currentTask.update(cleanObject({
      name: updatedTask.name,
      description: updatedTask.description,
      deadline: updatedTask.deadline,
      state: updatedTask.state,
    }), { transaction });
  } catch (err) {
    logger.warn('Task Service : error while updating a task', err);
    await transaction.rollback();
    throw createServerError('Server Error', 'Error while updating a task');
  }

  // Associations
  await setAssociations(_embedded, currentTask, null, transaction);

  await transaction.commit();
  await currentTask.reload({
    include: [
      {
        model: Barman,
        as: 'barmen',
      },
      {
        model: Kommission,
        as: 'kommission',
      },
    ],
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

  const task = await Task.findByPk(taskId);

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
