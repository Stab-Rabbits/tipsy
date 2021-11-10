import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 10px;
  width: 100vw;
  height: 10%;
  border-bottom: 1px #6F9283 solid;
`

const NavLink = styled(Link)`
  font-weight: 300;
  margin: 0 150px;
  text-decoration: none;
  color: #6F9283;
`
const CircleNavLink = styled(NavLink)`
  font-size: .75em;
`
const NavHyperlink = styled.a`
  font-weight: 300;
  margin: 0 150px;
  text-decoration: none;
  color: #6F9283;
`
const CircleNavHyperlink = styled(NavHyperlink)`
  font-size: .75em;
`
const Logo = styled.h1`
  font-weight: 500;
  color: #6F9283;
`

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 150px;
  border: 1px solid #6F9283;
  border-radius: 50%;
  height: 70px;
  width: 70px;
`



function Navigation() {
  const [ loginOrOut, setLoginOrOut ] = useState('LOGIN');
  const [ greetingMessage, setGreetingMessage ] = useState('');

  // check if user is logged in and conditionally render login or logout
  useEffect(() => {
    console.log('does nav run')
    const checkUserId = localStorage.getItem('userId');
    if (checkUserId !== null) {
      setLoginOrOut('LOGOUT') 
    }
    console.log(loginOrOut)
  }, []);

  // {if(loginOrOut === 'LOGOUT') {
  //   <p>Hello</p>
  // }}

  // when user clicks log out button, delete local storage userId item
  const logOut = () => {
    localStorage.removeItem('userId')
    console.log('logged out!')
  }

  // set up conditional rendering of login/logout button
  let logButton; 
  if (loginOrOut === 'LOGIN') {
    logButton = 
      <Circle>
        <CircleNavLink to={{
          pathname: `/login`
        }}>{ loginOrOut }</CircleNavLink>
      </Circle>
  } else if (loginOrOut === 'LOGOUT') {
    logButton = 
    <Circle>
      <CircleNavHyperlink 
          href="http://localhost:8080"
          onClick={() => {
            logOut();
      }}>{ loginOrOut }</CircleNavHyperlink>
    </Circle>
  }

  return (
    <NavContainer id='navigation'>
      <NavLink to={{
        pathname: `/`
      }}>Home</NavLink>

      <NavLink to={{
        pathname: `/addrecipe`
      }}>Add Recipe</NavLink>

      <Logo>Tipsy</Logo>

      <NavLink to={{
        pathname: `/mydrinks`
      }}>My Drinks</NavLink>
      
      <Circle>
        {logButton}
      </Circle>
      
    </NavContainer>
  )
}

export default Navigation
