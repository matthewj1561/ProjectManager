import ExternalServices from "../js/externalServices";
import { loadHeaderFooter, saveAuthToken, saveId, validateAllInputs } from "./utils.js";
loadHeaderFooter();

export default class Admin {
  constructor(outputSelector) {
    this.mainElement = document.getElementById(outputSelector);
    // this.token = null;
    this.services = new ExternalServices();
  }

  async login(creds) {
    try {
      const response = await this.services.loginRequest(creds);
      // this.token = response.accessToken;
      saveId(response.user_id);
      saveAuthToken(response.accessToken);
      window.location.href = "/user-home.html";
    } catch (err) {
      console.log(err);
    }
  }

  async signup(creds) {
    try {
      this.success = await this.services.signupRequest(creds);
      console.log(this.success);
      window.location.href = "/login.html";
    } catch (err) {
      console.log(err);
    }
  }

  loginPrep() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    this.login(
      { email: email, password: password }
    );
  }

  signupPrep() {
    const first = document.getElementById("first").value;
    const last = document.getElementById("last").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;
    const company = document.getElementById("company").value;
    if (password.length > 4 && password === confirm) {
      this.signup(
        { first_name: first, last_name: last, email: email, password: password, company: company }
      );
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
      <label for="first">First Name</label>
      <input type="text" placeholder="first" id="first"/>
    </p>
    <p>
      <label for="last">Last Name</label>
      <input type="text" placeholder="last" id="last"/>
    </p>
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
