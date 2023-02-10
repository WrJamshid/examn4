const renderData = (data) => {
  document.querySelector(".main-content").innerHTML = data
    .map(
      (user) => `
    <div data-category="${user.category}" class="content-item card ${user.category}">
    <img class="crazy-img" src="${user.image}">
    <p class="content-item__text">${user.title}</p>
    <div class="buy-price">
    <p class="price">${user.price} $</p>
    <button class="buy">BUY</button>
    </div>
    </div>
    `
      // <button class="remove">Remove</button>
    )
    .join("");
  for (let index = 0; index < data.length; index++) {
    data[index].inCart = 0;
  }

  let carts = document.querySelectorAll(".buy");
  for (let index = 0; index < carts.length; index++) {
    carts[index].addEventListener("click", () => {
      cartsNumber(data[index]);
      totalCost(data[index]);
      console.log(carts[index]);
    });
  }

  function onLoadCartNumbers() {
    let productsNumbers = localStorage.getItem("cartsNumber");
    if (productsNumbers) {
      document.querySelector(".korzinka span").textContent = productsNumbers;
    }
  }

  function cartsNumber(product) {
    let productsNumbers = localStorage.getItem("cartsNumber");
    productsNumbers = parseInt(productsNumbers);
    if (productsNumbers) {
      localStorage.setItem("cartsNumber", productsNumbers + 1);
      document.querySelector(".korzinka span").textContent =
        productsNumbers + 1;
    } else {
      localStorage.setItem("cartsNumber", 1);
      document.querySelector(".korzinka span").textContent = 1;
    }
    setItems(product);
  }
  function setItems(product) {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);

    if (cartItems != null) {
      if (cartItems[product.title] == undefined) {
        cartItems = {
          ...cartItems,
          [product.title]: product,
        };
      }

      cartItems[product.title].inCart += 1;
    } else {
      product.inCart = 1;
      cartItems = {
        [product.title]: product,
      };
    }
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
  }

  function totalCost(product) {
    let cartCost = localStorage.getItem("totalCost");
    if (cartCost != null) {
      cartCost = parseInt(cartCost);

      localStorage.setItem("totalCost", cartCost + product.price);
    } else {
      localStorage.setItem("totalCost", product.price);
    }
  }

  function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector(".product");
    let cartCost = localStorage.getItem("totalCost");
    if (cartItems && productContainer) {
      productContainer.innerHTML = "";
      Object.values(cartItems).map((item) => {
        productContainer.innerHTML += `
     <div class="pro-quan">

     <div class="products">
     <ion-icon name="close-circle"></ion-icon>
     <img src="${item.image}">
     <p class="korzinka-price">${item.price} $</p>
     </div>
     <div class="quantity">
    <button>-</button>
     <span>${item.inCart}</span>
    <button class"plus">+</button>
    <p class="total">
    ${item.inCart * item.price} $
    </p>
     </div>
     </div>

        `;
      });

      productContainer.innerHTML += `
      <div class="basketTotalContainer">
      <h4 class="basketTotalTitle">
      COUNT ${cartCost} $
      </h4>
      </div>
      `;
    }
  }

  onLoadCartNumbers();
  displayCart();
};

const url = "https://fakestoreapi.com/products";
fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => {
    renderData(data);
  });
