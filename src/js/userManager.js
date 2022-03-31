import ExternalServices from '../js/externalServices';
import {
    readAuthToken,
    renderListWithTemplate,
    saveAuthToken,
    addOnClick,
    createNewElement,
} from './utils.js';

export default class UserManager {
    constructor(filterSelector, listSelector) {
        this.filterElement = document.getElementsByClassName(filterSelector);
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
            this.user = await this.services.getUser(this.token);
            this.myTaskFilter();
        } else {
            // If they aren't logged in, send them to login page
            window.location.href = '/login.html';
        }
    }

    showUserTabs() {
        const myTasks1 = createNewElement(
            'li',
            'filter',
            'myTasks',
            'My Ongoing Tasks'
        );
        const myTasks2 = createNewElement(
            'li',
            'filter',
            'myTasks',
            'My Ongoing Tasks'
        );
        addOnClick(myTasks1, this.myTaskFilter.bind(this));
        addOnClick(myTasks2, this.myTaskFilter.bind(this));
        this.filterElement[0].append(myTasks1);
        this.filterElement[1].append(myTasks2);

        const allTasks1 = createNewElement(
            'li',
            'filter',
            'allTasks',
            'All Company Tasks'
        );
        const allTasks2 = createNewElement(
            'li',
            'filter',
            'allTasks',
            'All Company Tasks'
        );
        addOnClick(allTasks1, this.allTaskFilter.bind(this));
        addOnClick(allTasks2, this.allTaskFilter.bind(this));
        this.filterElement[0].append(allTasks1);
        this.filterElement[1].append(allTasks2);

        const unclaimedTasks1 = createNewElement(
            'li',
            'filter',
            'unclaimedTasks',
            'Unclaimed Tasks'
        );
        const unclaimedTasks2 = createNewElement(
            'li',
            'filter',
            'unclaimedTasks',
            'Unclaimed Tasks'
        );
        addOnClick(unclaimedTasks1, this.unclaimedTaskFilter.bind(this));
        addOnClick(unclaimedTasks2, this.unclaimedTaskFilter.bind(this));

        this.filterElement[0].append(unclaimedTasks1);
        this.filterElement[1].append(unclaimedTasks2);

        const myRequests1 = createNewElement(
            'li',
            'filter',
            'myRequests',
            'My Task Requests'
        );
        const myRequests2 = createNewElement(
            'li',
            'filter',
            'myRequests',
            'My Task Requests'
        );
        addOnClick(myRequests1, this.myRequestsFilter.bind(this));
        addOnClick(myRequests2, this.myRequestsFilter.bind(this));
        this.filterElement[0].append(myRequests1);
        this.filterElement[1].append(myRequests2);
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
        listElms[1].classList.add('active');
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
}
