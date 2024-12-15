const flagCarousel = document.getElementById("flag-carousel");
const dropdown = document.getElementById("dropdown");
const searchInput = document.getElementById("search-input");
const countryInfoBox = document.getElementById("country-info-box");
const countryFlag = document.getElementById("country-flag");
const countryName = document.getElementById("country-name");
const countryCurrency = document.getElementById("country-currency");
const countryAttractions = document.getElementById("country-attractions");

let countries = [];

// Fetch country data from REST Countries API
async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();

    countries = data.map((country) => ({
      name: country.name.common,
      flag: country.flags.svg,
      region: country.region,
      currency: country.currencies
        ? Object.values(country.currencies)[0].name
        : "Unknown Currency",
    }));

    populateFlagCarousel();
  } catch (error) {
    console.error("Error fetching country data:", error);
  }
}

// Populate the flag carousel
function populateFlagCarousel() {
  countries.forEach((country) => {
    const flagImg = document.createElement("img");
    flagImg.src = country.flag;
    flagImg.alt = `Flag of ${country.name}`;
    flagImg.addEventListener("click", () => selectCountry(country));
    flagCarousel.appendChild(flagImg);
  });
}

// Filter countries based on user input
function filterCountries() {
  const searchTerm = searchInput.value.toLowerCase();
  dropdown.innerHTML = "";
  dropdown.style.display = "none";

  if (searchTerm) {
    const filteredCountries = countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm)
    );

    if (filteredCountries.length) {
      dropdown.style.display = "block";
      filteredCountries.forEach((country) => {
        const countryDiv = document.createElement("div");
        countryDiv.textContent = country.name;
        countryDiv.onclick = () => selectCountry(country);
        dropdown.appendChild(countryDiv);
      });
    }
  }
}

// Fetch a landmark or tourist information for a specific country
async function fetchLandmark(countryName) {
  try {
    // Fetch the Wikipedia page for the country's tourism page
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=extracts&exintro=&titles=Tourism_in_${encodeURIComponent(
        countryName
      )}`
    );
    const data = await response.json();
    const pages = data.query.pages;

    const page = pages[Object.keys(pages)[0]];

    if (page && page.extract) {
      // Extract the content from the Wikipedia page
      const content = page.extract;

      // Look for mentions of landmarks or tourist attractions
      const landmarkRegex = /(?:Landmarks|Tourist\s*Attractions|Tourism\s*Highlights)([\s\S]*?)(?:<\/ul>)/is;
      const match = content.match(landmarkRegex);

      if (match) {
        // Extract the landmark list
        const landmarkList = match[1]
          .replace(/<li>/g, "")
          .replace(/<\/li>/g, "")
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item.length > 0);

        return landmarkList.slice(0, 1); // Return only the first landmark
      }
    }

    // If no landmarks were found, provide a clickable link to the Wikipedia tourism page
    return [
      `<a href="https://en.wikipedia.org/wiki/Tourism_in_${encodeURIComponent(
        countryName
      )}" target="_blank">Click here to see more landmarks and tourist sites in ${countryName}</a>`,
    ];
  } catch (error) {
    console.error("Error fetching landmarks:", error);
    return [
      `<a href="https://en.wikipedia.org/wiki/Tourism_in_${encodeURIComponent(
        countryName
      )}" target="_blank">Click here to see more landmarks and tourist sites in ${countryName}</a>`,
    ];
  }
}

// Display selected country details
async function selectCountry(country) {
  searchInput.value = "";
  dropdown.style.display = "none";

  countryFlag.src = country.flag;
  countryName.textContent = country.name;
  countryCurrency.textContent = country.currency;

  // Fetch and display country-specific landmarks
  const landmarks = await fetchLandmark(country.name);
  countryAttractions.innerHTML = landmarks
    .map((landmark) => `<li>${landmark}</li>`)
    .join("");

  countryInfoBox.style.display = "block";
}

// Fetch country data on page load
fetchCountries();
