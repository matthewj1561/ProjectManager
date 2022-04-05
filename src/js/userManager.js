import ExternalServices from '../js/externalServices';
import {
    readAuthToken,
    renderListWithTemplate,
    saveAuthToken,
    addOnClick,
    createNewElement,
    readId,
} from './utils.js';
import { Task } from './taskModel';

export default class UserManager {
    constructor(filterSelector, listSelector) {
        this.filterElement = document.getElementById(filterSelector);
        this.listElement = document.getElementById(listSelector);
        this.token = null;
        this.user = {};
        this.services = new ExternalServices();
        this.taskList = [];
        this.activeFilter = '';
    }

    async init() {
        this.token = readAuthToken();
        if (this.token !== null) {
            this.taskList = await this.services.getAllTasks(this.token);
            const myId = { _id: readId() };
            this.user = await this.services.getUser(this.token, myId);
            this.myTaskFilter();
        } else {
            // If they aren't logged in, send them to login page
            window.location.href = '/login.html';
        }
    }

    showUserTabs() {
        const myTasks = createNewElement(
            'li',
            'filter',
            'myTasks',
            'My Ongoing Tasks'
        );
        addOnClick(myTasks, this.myTaskFilter.bind(this));
        this.filterElement.appendChild(myTasks);

        const allTasks = createNewElement(
            'li',
            'filter',
            'allTasks',
            'All Company Tasks'
        );
        addOnClick(allTasks, this.allTaskFilter.bind(this));
        this.filterElement.appendChild(allTasks);

        const unclaimedTasks = createNewElement(
            'li',
            'filter',
            'unclaimedTasks',
            'Unclaimed Tasks'
        );
        addOnClick(unclaimedTasks, this.unclaimedTaskFilter.bind(this));

        this.filterElement.appendChild(unclaimedTasks);

        const myRequests = createNewElement(
            'li',
            'filter',
            'myRequests',
            'My Task Requests'
        );
        addOnClick(myRequests, this.myRequestsFilter.bind(this));
        this.filterElement.appendChild(myRequests);
    }

    showTaskList(filteredTasks) {
        // Clear current list first

        this.listElement.innerHTML = '';
        const template = document.getElementById('task-template');

        renderListWithTemplate(
            template,
            this.listElement,
            filteredTasks,
            this.fillTaskThumbnail
        );
    }

    fillTaskThumbnail(element, task) {
        element.querySelector('.title').innerHTML = task.title;
        element.querySelector('.priority').innerHTML += task.priority;
        element.querySelector('.due-date').innerHTML += task.due_date;

        element.querySelector('.task-display').href += task._id;

        return element;
    }

    updateActiveFilter(filterSelector) {
        let filterList = document.querySelectorAll('.filter');

        filterList.forEach((item) => {
            item.classList.remove('active');
        });
        let listElms = document.querySelectorAll(filterSelector);
        listElms[0].classList.add('active');
        // listElms[1].classList.add('active');
        // document.querySelector(filterSelector).classList.add('active');
        // document.querySelector(filterSelector).classList.add('active');
    }

    /********
     * FILTERS
     *
     * Different filters to narrow down task search
     */

    myTaskFilter() {
        const filteredList = this.taskList.filter(
            (task) => task.assigned_to === this.user._id
        );

        this.updateActiveFilter('#myTasks');

        this.showTaskList(filteredList);
    }

    allTaskFilter() {
        this.updateActiveFilter('#allTasks');

        this.showTaskList(this.taskList);
    }

    unclaimedTaskFilter() {
        const filteredList = this.taskList.filter(
            (task) => task.assigned_to === null
        );

        this.updateActiveFilter('#unclaimedTasks');

        this.showTaskList(filteredList);
    }

    myRequestsFilter() {
        const filteredList = this.taskList.filter(
            (task) => task.creator_user_id === this.user._id
        );

        this.updateActiveFilter('#myRequests');

        this.showTaskList(filteredList);
    }

    /***********
     * Adding New Task Funcitionality
     */

    async newTaskPrep(event) {
        event.preventDefault();
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;

        let title = document.getElementById('task-title').value;
        let desc = document.getElementById('taskDesc').value;
        const status = document.getElementById('status').value;
        let dueDate = document.getElementById('dueDate').value;
        const priority = document.getElementById('priority').value;

        if (title == '' || desc == '' || dueDate == '') {
            alert('Please fill out all fields');
        } else {
            let newTask = new Task();
            newTask._id = 1000;
            newTask.title = title;
            newTask.description = desc;
            newTask.date_created = today;
            newTask.creator_user_id =
                window.localStorage.getItem('task-user-id');
            newTask.assigned_to = null;
            newTask.status = status;
            newTask.due_date = dueDate;
            newTask.priority = priority;

            await this.services.postTask(newTask);
            document.getElementById('taskForm').reset();
            const modal = document.getElementById('myModal');
            modal.style.display = 'none';
            this.allTaskFilter();
        }
    }

    showTaskAddition() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;

        const display = `
      <form id='taskForm'>
      
          <legend>Add new Task</legend>
          <p>
          <label for="task-title">Task Title</label>
          <input type="text" placeholder="Title" id="task-title"/>
          </p>
          <p>
          <label for="taskDesc">Task Description</label>
          <textarea placeholder="Description" id="taskDesc" /></textarea>
          </p>
          
          <div>
          <p>Select task status</p>
          
          <select name="status" id="status">
            <option value="Unclaimed">Unclaimed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
    
          </select>

          </div>

          <p>
          <label for="duedate">Due Date</label>
          <input type="text" value="${today}" id="dueDate" />
          </p>

          <div>
          <p>Select task status</p>
          
      

          <select name="priority" id="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
    
          </select>

          </div>

          <button type="submit" id="submitButton">Add Task</button>
  
      </form>`;

        document.getElementById('modal-content').innerHTML += display;
        const submit = document.getElementById('submitButton');
        submit.addEventListener('click', this.newTaskPrep.bind(this));
    }
}
