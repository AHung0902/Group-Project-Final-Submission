// Annyang Configuration
if (annyang) {
  // Define Commands
  const commands = {
    "hello": () => alert("Hello, World!"),
    "change the color to *color": (color) => document.body.style.backgroundColor = color,
    "navigate to *page": (page) => {
      const pageLower = page.toLowerCase();
      if (pageLower === "home") window.location.href = "index.html";
      else if (pageLower === "stocks") window.location.href = "stocks.html";
      else if (pageLower === "dogs") window.location.href = "dogs.html";
    },
    "lookup *stock": (stock) => {
      document.getElementById("stockTicker").value = stock.toUpperCase();
      lookupStock();
    },
    "load dog breed *breed": (breed) => loadDogBreed(breed)
  };

  // Add Commands to Annyang
  annyang.addCommands(commands);
  annyang.start();
}

// Home Page: Fetch and Display Random Quote
if (document.title === "Home") {
  fetch("https://api.quotable.io/random")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("quote").innerHTML = `<blockquote>${data.content}</blockquote><p>- ${data.author}</p>`;
    })
    .catch((error) => console.error("Error fetching quote:", error));
}

// Dogs Page: Fetch and Display Dog Images and Breeds
if (document.title === "Dogs") {
  const carousel = document.getElementById("carousel");
  const breedsDiv = document.getElementById("breeds");

  // Load Random Dog Images
  fetch("https://dog.ceo/api/breeds/image/random/10")
    .then((response) => response.json())
    .then((data) => {
      data.message.forEach((imgUrl) => {
        const img = document.createElement("img");
        img.src = imgUrl;
        img.classList.add("carousel-image");
        carousel.appendChild(img);
      });
    })
    .catch((error) => console.error("Error fetching dog images:", error));

  // Load Dog Breeds and Buttons
  fetch("https://api.thedogapi.com/v1/breeds")
    .then((response) => response.json())
    .then((breeds) => {
      breeds.forEach((breed) => {
        const button = document.createElement("button");
        button.innerText = breed.name;
        button.classList.add("custom-btn");
        button.onclick = () => showBreedInfo(breed);
        breedsDiv.appendChild(button);
      });
    })
    .catch((error) => console.error("Error fetching breeds:", error));
}

// Show Dog Breed Info
function showBreedInfo(breed) {
  const breedInfoDiv = document.getElementById("breed-info");
  breedInfoDiv.innerHTML = `
    <h2>${breed.name}</h2>
    <p>${breed.temperament || "No description available."}</p>
    <p>Lifespan: ${breed.life_span}</p>
  `;
}