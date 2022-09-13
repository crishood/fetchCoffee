/* 1. Fetch
https://raw.githubusercontent.com/wondercraft-co/front-end-test/master/data/newProducts.json
This data we ahve in this api is horrible an messy
and we need to fix it.
TODO: use the Fn below to fetch the data
*/

const fetchData = async () => {
  const res = await fetch(
    "https://raw.githubusercontent.com/wondercraft-co/front-end-test/master/data/newProducts.json"
  )
    .then((response) => response.json()) //imprimir los datos en la consola
    .catch((err) => console.log("Solicitud fallida", err));

  return res;
};

/* 2. 
Lets normalize the data
You'll need to do a little bit of cleanup to the fetched data. Each product in the final array must include the following fields:
data = [{
   id, name, image, country, 
   price (for some products, you’ll need to calculate the total price by applying the tax to the base price)
}];
TODO: use Fn below to normalize the data
*/

//Empty object to store the flattened object
let flattendObj = {};

//Recursive function to flat objects
const flattenObject = (obj) => {
  // Get the keys of an object, if the key is another object it calls itself
  Object.keys(obj).forEach((key) => {
    var newKey = `${key}`;
    if (typeof obj[key] === "object") {
      flattenObject(obj[key]);
    } else {
      flattendObj[newKey] = obj[key];
    }
  });
};

const normalizeData = async () => {
  const data = await fetchData();
  //Empty array to store the data for rendering
  let render = [];
  data.roasteries.by_country.map((item) => {
    let country = "";
    for (i in item) {
      // Item is an enum value so we get the name of the country
      country = i;
    }
    //Go through the values in a cycle
    Object.values(item).forEach((value) => {
      //Each value has an array of objects
      value.map((element) => {
        //Call the function to flatten each object of the array
        flattenObject(element);
        // Create a country key with a country value in the flat object
        flattendObj.country = country.toUpperCase();
        // Add each object object to the empty array
        render.push(Object.assign({}, flattendObj));
      });
    });
  });

  return render;
};

/* 3.
Render the data.
Now lets simply render a list of items given the data above
*/
const render = async () => {
  const data = await normalizeData();
  console.log(data);
  const app = document.querySelector("#app");
  data.forEach(({ country, name, image, price }) => {
    const element = `
    <div>
        <h2>${name}</h2>
        <h3>${country}</h3>
        <img src='${image}'/>
        <p>${price}</p>
    </div>`;
    app.insertAdjacentHTML("beforeend", element);
  });
};

render();
