import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  let errorMessage; 

  // login is a post request
  const handleLogin = ((username, password) => {
    console.log(JSON.stringify({ username, password }));
    
    // fetch is built into the browser
    fetch('/api/login', {
      method: 'post',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
      //if user is authenticated
      console.log(data)
      if (data.validated) {
        localStorage.setItem('userId', data.userId);
        setMessage(data.message);
        // redirect user to home page
        window.location.href='http://localhost:8080/';
      } else {
        setMessage(data.message);
        console.log('Invalid username/password');
      }
    })
    .catch(function(e) {
        // set error message to render 
        window.alert('Something went wrong');
        console.error(e.message);
        return e;
})
  })

  return (
    <div>
      <div>
        <h2>Username</h2>
        <form>
          <input
            id="login-username"
            type="text"
            // placeholder="login username placeholder..."
            onChange={(event) => setUsername(event.target.value)}
          />
        </form>
        <h2>Password</h2>
        <form>
          <input
            id="login-password"
            type="password"
            // placeholder="login password placeholder..."
            onChange={(event) => setPassword(event.target.value)}
          />
        </form>


      </div>
      <div>
        <button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            return handleLogin(username, password);
          }}>
          Log in
        </button>
      </div>
      {errorMessage}
      <div>
        <p>{message}</p>
      </div>
      <div>
        <p>Don't have an account?</p>
        <Link to={
          { pathname: '/signup' }
        }>Sign up</Link>
      </div>
    </div>
  )
}

export default LoginForm;
