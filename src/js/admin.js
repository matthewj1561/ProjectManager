import ExternalServices from '../js/externalServices';
import { loadHeaderFooter, saveAuthToken, validateAllInputs } from './utils.js';

export default class Admin {
    constructor(outputSelector) {
        this.mainElement = document.getElementById(outputSelector);
        this.token = null;
        this.services = new ExternalServices();
    }

    async login(creds, next) {
        try {
            this.token = await this.services.loginRequest(creds);
            saveAuthToken(this.token);
            window.location.href = '/user-home.html';
            // window.location.assign("/user-home/");
            next();
        } catch (err) {
            console.log(err);
        }
    }

    async signup(creds, next) {
        try {
            this.success = await this.services.signupRequest(creds);
            console.log(this.success);
            window.location.href = '/login/';
            // window.location.assign("/login/");
            next();
        } catch (err) {
            console.log(err);
        }
    }

    loginPrep() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const inputsToValidate = [
            { value: email, regexPattern: /\*@*.com/ },
            { value: password, regexPattern: /\*/ },
        ];
        // validateAllInputs(inputsToValidate);

        this.login(
            { email: email, password: password },
            this.showTasks.bind(this)
        );
    }

    newTaskPrep(event) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;
        const company = document.getElementById('company').value;
        // let output = '';
        // for (const entry of data) {
        //     output = output = entry[0] + '=' + entry[1] + '\n';
        // }
        // console.log(output);
    }

    signupPrep() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm').value;
        const company = document.getElementById('company').value;
        this.signup(
            {
                email: email,
                password: password,
                confirmPassword: confirm,
                company: company,
            },
            this.showTasks.bind(this)
        );
    }

    async showTasks() {
        try {
            const tasks = await this.services.getAllTasks(this.token);
            console.log(tasks);
        } catch (err) {
            console.log(err);
        }
    }

    showLogin() {
        const form = `<fieldset class="login-form">
    <legend>Login</legend>
    <p>
      <label for="email">Email</label>
      <input type="text" placeholder="email" id="email"/>
    </p>
    <p>
      <label for="password">Password</label>
      <input type="password" placeholder="password" id="password" />
    </p>
    <button type="submit" id="submitButton">Login</button>
  </fieldset>`;

        this.mainElement.innerHTML = form;
        const submit = document.getElementById('submitButton');
        submit.addEventListener('click', this.loginPrep.bind(this));
    }

    showSignup() {
        const form = `<fieldset class="login-form">
    <legend>Signup</legend>
    <p>
      <label for="email">Email</label>
      <input type="text" placeholder="email" id="email"/>
    </p>
    <p>
      <label for="password">Password</label>
      <input type="password" placeholder="Password" id="password" />
    </p>
    <p>
      <label for="confirm">Confirm Password</label>
      <input type="confirm" placeholder="Confirm Password" id="confirm" />
    </p>
    <p>
      <label for="company">Company Name</label>
      <input type="company" placeholder="Company" id="company" />
    </p>
    <button type="submit" id="submitButton">Signup</button>
  </fieldset>`;

        this.mainElement.innerHTML = form;
        const submit = document.getElementById('submitButton');
        submit.addEventListener('click', this.signupPrep.bind(this));
    }

    showUserTabs() {
        const display = `
    <ul>
      <li class="active" id="currentTasks">My Ongoing Tasks</li>
      <li id="allMyTasks">All My Tasks</li>
      <li id="unassignedTasks">Unassigned Tasks</li>
      <li id="myRequests">My Task Requests</li>
    </ul>`;

        this.mainElement.innerHTML = display;
    }

    showTaskAddition() {
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
            
            <label for="behind">Status</label>
            <input type="radio" id="behind" name="status" value="Behind">
            <br>
            <label for="ontrack">HTML</label>
            <input type="radio" id="ontrack" name="status" value="On Track">
            <br>
            <label for="ahead">CSS</label>
            <input type="radio" id="ahead" name="status" value="Ahead">

            </div>

            <p>
            <label for="duedate">Due Date</label>
            <input type="text" placeholder="Company" id="company" />
            </p>

            <div>
            <p>Select task status</p>
            
            <label for="low">Low</label>
            <input type="radio" id="low" name="priority" value="Low">
            <br>
            <label for="medium">Medium</label>
            <input type="radio" id="medium" name="priority" value="Medium">
            <br>
            <label for="high">High</label>
            <input type="radio" id="high" name="priority" value="High">

            </div>

            <button type="submit" id="submitButton">Add Task</button>
    
    </form
        `;

        this.mainElement.innerHTML += display;
        const submit = document.getElementById('submitButton');
        submit.addEventListener('click', this.newTaskPrep.bind(this));
    }
}
