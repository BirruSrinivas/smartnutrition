// Get the API key from Spoonacular
const apiKey = 'a000ccc1a4894c8ab36919da84027506';  // Replace with your API key

document.getElementById('user-details-form').addEventListener('submit', function (e) {
  e.preventDefault();

  // Collect user data
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const height = document.getElementById('height').value;
  const weight = document.getElementById('weight').value;
  const mobile = document.getElementById('mobile').value;
  const email = document.getElementById('email').value;

  // Display the user data
  displayUserData(name, age, height, weight, mobile, email);
  // Generate nutritional analysis
  generateNutritionAnalysis(weight, height, age);
  // Generate personalized recommendations ✅ (ADD THIS LINE)
  generatePersonalizedRecommendations();

  // Generate meal plans with images using Spoonacular API
  generateMealPlansWithSpoonacular();
  // Generate health dashboard
  generateDashboard(weight, height);
});



async function generateMealPlansWithSpoonacular() {
  const mealsContainer = document.getElementById('meal-plans-data');
  mealsContainer.innerHTML = '<p>Loading meal suggestions...</p>';  // Loading message

  try {
    // Fetch meal suggestions based on a simple diet type (e.g., 'vegetarian')
    const response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=3&tags=vegetarian`);
    
    // Check for HTTP errors (response.status !== 200)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || 'No additional error message'}`);
    }

    // Parse the JSON data
    const data = await response.json();

    console.log('API Response:', data);  // Log the entire response for debugging

    // Check if the recipes array exists and has elements
    if (data.recipes && data.recipes.length > 0) {
      const meals = data.recipes.map(recipe => {
        const nutrition = recipe.nutrition ? recipe.nutrition.nutrients.find(n => n.title === 'Calories') : null;
        
        return `
          <div class="meal-suggestion">
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" class="suggestion-img">
            <p><strong>Calories:</strong> ${nutrition ? nutrition.amount : 'Not available'} kcal</p>
            <p><strong>Ingredients:</strong> ${recipe.extendedIngredients.map(ingredient => ingredient.name).join(', ')}</p>
            <a href="${recipe.sourceUrl}" target="_blank">View Recipe</a>
          </div>
        `;
      }).join('');
      mealsContainer.innerHTML = meals;
    } else {
      mealsContainer.innerHTML = '<p>No meal suggestions available. Try changing your preferences or check back later.</p>';
    }
  } catch (error) {
    console.error("Error fetching meal suggestions:", error);
    mealsContainer.innerHTML = `<p>Failed to load meal suggestions. ${error.message}. Please try again later.</p>`;
  }
}




function displayUserData(name, age, height, weight, mobile, email) {
  const userDetails = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Age:</strong> ${age}</p>
    <p><strong>Height:</strong> ${height} cm</p>
    <p><strong>Weight:</strong> ${weight} kg</p>
    <p><strong>Mobile:</strong> ${mobile}</p>
    <p><strong>Email:</strong> ${email}</p>
  `;
  document.getElementById('user-form').innerHTML = userDetails;
}

function generateNutritionAnalysis(weight, height, age) {
  const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
  const analysis = `
    <p><strong>BMI:</strong> ${bmi}</p>
    <p><strong>Status:</strong> ${getBMIStatus(bmi)}</p>
  `;
  document.getElementById('analysis').innerHTML = analysis;
}

function getBMIStatus(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi <= 24.9) return 'Normal weight';
  if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
  return 'Obesity';
}


async function generatePersonalizedRecommendations() {
  const recommendationsContainer = document.getElementById('personalized-recommendations');
  recommendationsContainer.innerHTML = '<p>Loading personalized recommendations...</p>';  // Loading message

  try {
    // Example: Fetch personalized recommendations (this could be based on user preferences or data)
    const response = await fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=3`);

    // Check for HTTP errors (response.status !== 200)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.message || 'No additional error message'}`);
    }

    // Parse the JSON data
    const data = await response.json();

    console.log('API Response for Recommendations:', data);  // Log the entire response for debugging

    // Check if the recipes array exists and has elements
    if (data.recipes && data.recipes.length > 0) {
      const recommendations = data.recipes.map(recipe => {
        const nutrition = recipe.nutrition ? recipe.nutrition.nutrients.find(n => n.title === 'Calories') : null;
        
        return `
          <div class="recommendation-item">
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}" class="recommendation-img">
            <p><strong>Calories:</strong> ${nutrition ? nutrition.amount : 'Not available'} kcal</p>
            <p><strong>Ingredients:</strong> ${recipe.extendedIngredients.map(ingredient => ingredient.name).join(', ')}</p>
            <a href="${recipe.sourceUrl}" target="_blank">View Recipe</a>
          </div>
        `;
      }).join('');
      recommendationsContainer.innerHTML = recommendations;
    } else {
      recommendationsContainer.innerHTML = '<p>No personalized recommendations available. Try changing your preferences or check back later.</p>';
    }
  } catch (error) {
    console.error("Error fetching personalized recommendations:", error);
    recommendationsContainer.innerHTML = `<p>Failed to load personalized recommendations. ${error.message}. Please try again later.</p>`;
  }
}


function generateDashboard(weight, height) {
  const ctx = document.getElementById('nutritionChart').getContext('2d');
  const nutritionChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Height (cm)', 'Weight (kg)'],
      datasets: [{
        label: 'User Health Data',
        data: [height, weight],
        backgroundColor: ['#4CAF50', '#FFC107'],
        borderColor: ['#388E3C', '#FF9800'],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
