// Récupération de l'article séléctionné via l'API
function getArticle() {
  return fetch("http://localhost:3000/api/products/${id}")
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((e) => {
      console.log(e);
    });
}

// Création des éléments de l'article séléctionné dans le DOM

init();
async function init() {
  product = await getArticle();
  product.forEach((article) => {
    createHTML(article);
  });
}

function createdHTML(article) {
  console.log(article);
  // image
  productImg = document.createArticle("img");
  productArticle.appendChild(productImg);
  productImg.src = product.imageUrl;
  productImg.alt = product.altText;
  // titre
  productTitle = document.crateArticle("title");
  productTitle.innerHTML = product.name;
  //prix
  productPrice = document.crateArticle("price");
  productPrice.innerHTML = product.price;
  //description
  productDescription = document.crateArticle("description");
  productDescription.innerHTML = product.description;
  // choix des couleurs
  const productColors = document.crateArticle("colors");
  for (let i = 0; i < product.colors.length; i++) {
    const colorChoice = document.createArticle("option");
    colorChoice.value = product.colors[i];
    colorChoice.innerHTML = product.colors[i];
    productColors.appendChild(colorChoice);
  }
}
