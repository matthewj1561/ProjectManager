import ExternalServices from "../js/externalServices";
import { loadHeaderFooter, validateAllInputs } from "./utils.js";
loadHeaderFooter();

export default class Admin {
  constructor(outputSelector) {
    this.mainElement = document.getElementById(outputSelector);
    this.token = null;
    this.services = new ExternalServices();
  }

  async login(creds, next) {
    try {
      this.token = await this.services.loginRequest(creds);
      console.log(this.token);
      next();
    } catch (err) {
      console.log(err);
    }
  }

  async signup(creds, next) {
    try {
      this.token = await this.services.signupRequest(creds);
      console.log(this.token);
      next();
    } catch (err) {
      console.log(err);
    }
  }

  loginPrep() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const inputsToValidate = [
      { value: email, regexPattern: /\*@*.com/ },
      { value: password, regexPattern: /\*/ }
    ]
    // validateAllInputs(inputsToValidate);

    this.login(
      { email: email, password: password },
      this.showTasks.bind(this)
    );
  }

  signupPrep() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;
    const company = document.getElementById("company").value;
    this.signup(
      { email: email, password: password, confirmPassword: confirm, company: company },
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
    const submit = document.getElementById("submitButton");
    submit.addEventListener("click", this.loginPrep.bind(this));
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
    const submit = document.getElementById("submitButton");
    submit.addEventListener("click", this.signupPrep.bind(this));
  }
}
