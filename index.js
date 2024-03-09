import express from "express";
import axios from "axios";
import categories from "./options.json" assert { type: "json" };

const app = express();
const port = process.env.port || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const result = await axios.get(
      "https://www.thecocktaildb.com/api/json/v1/1/random.php"
    );
    let drink = result.data.drinks[0];
    let ingredients = [];
    for (let i = 1; i < 10; i++) {
      if (drink["strIngredient" + i] === null) {
        break;
      }
      if (drink["strMeasure" + i] === null) {
        drink["strMeasure" + i] = "";
      }
      const element =
        drink["strMeasure" + i] + " " + drink["strIngredient" + i];
      ingredients.push(element);
    }

    res.render("index.ejs", {
      name: drink.strDrink,
      id: drink.idDrink,
      glass: drink.strGlass,
      category: drink.strCategory,
      instructions: drink.strInstructions,
      thumb: drink.strDrinkThumb,
      ingredients: ingredients,
      alcoholic: drink.strAlcoholic,
      category_a: categories.a,
      category_c: categories.c,
      category_g: categories.g,
      category_i: categories.i,
    });
  } catch (error) {
    console.log(error.response.message);
    res.statusCode(404);
  }
});

app.post("/search", async (req, res) => {
  try {
    req.body[Object.keys(req.body)] = decodeURIComponent(req.body[Object.keys(req.body)])
    let result = await axios.get(
      "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
      {
        params: req.body,
      }
    );
    res.render("gallery.ejs", {
      data: result.data["drinks"],
      title: req.body[Object.keys(req.body)],
    });
  } catch (error) {
    console.log(error);
  }
});
app.post("/searchbar", async (req, res) => {
    if(req.body.s !== ""){
        try {
          let result = await axios.get(
            "https://www.thecocktaildb.com/api/json/v1/1/search.php",
            {
              params: req.body,
            }
          );
          if(result.data["drinks"]){
              let title = req.body[Object.keys(req.body)].split("_").join(" ");
              title = title[0].toUpperCase() + title.slice(1).toLowerCase();
              res.render("gallery.ejs", {
                data: result.data["drinks"],
                title: title,
              });
          } else{
              res.redirect("/")
          }
        } catch (error) {
          console.log(error);
        }
    } else{
        res.redirect("/")
    }
});

app.get("/:id", async (req, res) => {
  let id = req.url.slice(1);
  try {
    const result = await axios.get(
      "http://www.thecocktaildb.com/api/json/v1/1/lookup.php",
      {
        params: {
          i: id,
        },
      }
    );
    let drink = result.data.drinks[0];
    let ingredients = [];
    for (let i = 1; i < 10; i++) {
      if (drink["strIngredient" + i] === null) {
        break;
      }
      if (drink["strMeasure" + i] === null) {
        drink["strMeasure" + i] = "";
      }
      const element =
        drink["strMeasure" + i] + " " + drink["strIngredient" + i];
      ingredients.push(element);
    }

    res.render("index.ejs", {
      name: drink.strDrink,
      id: drink.idDrink,
      glass: drink.strGlass,
      category: drink.strCategory,
      instructions: drink.strInstructions,
      thumb: drink.strDrinkThumb,
      ingredients: ingredients,
      alcoholic: drink.strAlcoholic,
      category_a: categories.a,
      category_c: categories.c,
      category_g: categories.g,
      category_i: categories.i,
    });
  } catch (error) {
    console.log(error.response.message);
    res.statusCode(404);
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
