import React from 'react'
import { Link } from 'react-router-dom';
import drinkUtils from '../../utils/drink.js'

function MyList(props) {
  const { userFavs, userRecipes, title } = props;

  // initalize list variables
  let ListItems;
  let userRecipiesList = (userRecipes) ? userRecipes.data : [];
  let userFavsList = (userFavs) ? userFavs.data : [];

  // if title includes recipies and we have recipies to display
  // --> display recipies 
  if (userFavsList !== undefined && title.includes('Drinks')) {
    ListItems = userFavsList.map((element, index) => {
      return <li>{drinkUtils.getDrinkNameFromID(element.cocktail_id)}</li>
    })
  } else if (userRecipiesList !== undefined && title.includes('Recipes')) {
    ListItems = userRecipiesList.map((element, index) => {
      return <li>
              Name: {element.name}
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
