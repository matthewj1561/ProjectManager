import ExternalServices from './externalServices.js';
import TaskDetails from './task-details.js';
import { getParam, loadHeaderFooter } from './utils.js';

const taskId = getParam('task');
const externalServices = new ExternalServices();

const task = new TaskDetails(taskId, externalServices);
task.init();
