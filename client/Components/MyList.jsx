import React from 'react'
import { Link } from 'react-router-dom';
import drinkUtils from '../../utils/drink.js'

function MyList(props) {
  // delete recipe from DB
  function handleRecipeClick (name){
    const body = {
      id: localStorage.userId, 
      name: name
    }

    // delete recipe
    fetch(`/api/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON'
      },
      body: JSON.stringify(body)
    }).then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err))
  }

  // Delete drink from User favs in DB
  function handleFavClick(cocktailId) {
    const body = {
      id: localStorage.userId,
      cocktailId: cocktailId
    }

    // delete recipe
    fetch(`/api/faves/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON'
      },
      body: JSON.stringify(body)
    }).then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err))
  }



  const { userFavs, userRecipes, title } = props;

  // initalize list variables
  let ListItems;
  let userRecipiesList = (userRecipes) ? userRecipes.data : [];
  let userFavsList = (userFavs) ? userFavs.data : [];

  // if title includes recipies and we have recipies to display
  // --> display recipies 
  if (userFavsList !== undefined && title.includes('Drinks')) {
    ListItems = userFavsList.map((element, index) => {
      return <li>{drinkUtils.getDrinkNameFromID(element.cocktail_id)} <button onClick={() => handleFavClick(element.cocktail_id)}>Delete</button></li>
    })
  } else if (userRecipiesList !== undefined && title.includes('Recipes')) {
    ListItems = userRecipiesList.map((element, index) => {
      return <li>
        Name: {element.name} <button onClick={() => handleRecipeClick(element.name)}>Delete</button>
              <ul> 
                  <li> Ingredients: {element.ingredients} </li>
                  <li> Instructions: {element.instructionlist} </li>
              </ul> 
            </li>

    })
  }


    // if want to get fancy and create hyperlinks to each favorite drink info / each user recipe drink info
    // <li>
    //   <Link to {{
    //   pathname: `/drink/${drinkID}`,
    //     state: {
    //       drinkObj
    //     }
    //   }}></Link>
    // </li>
;

  return (
    <div>
      <h2>{ title }</h2>
      <ul>
        { ListItems }
      </ul>
    </div>
  )
}

export default MyList
