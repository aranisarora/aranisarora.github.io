document.addEventListener('DOMContentLoaded', () => {
    const createMealForm = document.getElementById('createMealForm');
    const newMealNameInput = document.getElementById('newMealName');
    // Additional fields for meal ingredients can be added here

    const addMealToStockBtn = document.getElementById('addMealToStock');
    const mealSelect = document.getElementById('mealSelect');
    const addMealItemBtn = document.getElementById('addMealItem');
    const mealItemsContainer = document.getElementById('mealItemsContainer');

    const markMealConsumedBtn = document.getElementById('markMealConsumed');
    const consumedMealSelect = document.getElementById('consumedMealSelect');


    addMealToStockBtn.addEventListener('click', () => {
        const selectedMealId = mealSelect.value;
        addMealToStock(selectedMealId);
    });

    markMealConsumedBtn.addEventListener('click', () => {
        const selectedMealId = consumedMealSelect.value;
        markMealAsConsumed(selectedMealId);
    });
    addMealItemBtn.addEventListener('click', () => {
        addMealItemField();
    });

    createMealForm.addEventListener('submit', event => {
        event.preventDefault();
        const mealName = newMealNameInput.value.trim();
        const mealItems = collectMealItems();
        createMeal(mealName, mealItems);
    });

    fetchMeals();
});



function createMeal(mealName, mealItems) {
    console.log('Meal items:', mealItems);

    const mealData = {
        name: mealName,
        items: mealItems
    };

    fetch('http://localhost:3000/meals', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(mealData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Meal created:', data);
        clearMealCreationForm();
        // Optionally, update the UI here to show the created meal
    })
    .catch(error => {
        console.error('Error creating meal:', error);
        // Optionally, update the UI to show an error message
    });
}

function clearMealCreationForm() {
    document.getElementById('newMealName').value = '';
    document.getElementById('mealItemsContainer').innerHTML = ''; // Clear the meal items
}
function addMealItemField() {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'meal-item mb-3';
    itemDiv.innerHTML = `
        <input type="text" placeholder="Item Name" class="meal-item-name w-full mb-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
        <input type="number" placeholder="Quantity" class="meal-item-quantity w-full mb-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
        <select class="meal-item-unit w-full mb-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="liters">liters</option>
            <option value="pieces">pieces</option>
        </select>`;
    mealItemsContainer.appendChild(itemDiv);
}

function collectMealItems() {
    const mealItems = [];
    document.querySelectorAll('.meal-item').forEach(itemDiv => {
        const itemName = itemDiv.querySelector('.meal-item-name').value.trim();
        const itemQuantity = itemDiv.querySelector('.meal-item-quantity').value.trim();
        const itemUnit = itemDiv.querySelector('.meal-item-unit').value;
        if (itemName && itemQuantity && itemUnit) {
            // Ensure the object structure matches your backend schema
            mealItems.push({ itemName, quantity: itemQuantity, unit: itemUnit });
        }
    });
    return mealItems;
}

function markMealAsConsumed(mealId) {
    fetch(`http://localhost:3000/meals/markAsConsumed`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealId }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Meal marked as consumed:', data);
            // Optionally update the UI here
        })
        .catch(error => console.error('Error:', error));
}

function fetchMeals() {
    fetch(`http://localhost:3000/meals`)
        .then(response => response.json())
        .then(meals => {
            populateMealSelects(meals);
            displayMeals(meals);
        })
        .catch(error => console.error('Error:', error));
}

function populateMealSelects(meals) {
    const mealSelectHTML = meals.map(meal => `<option value="${meal._id}">${meal.name}</option>`).join('');
    mealSelect.innerHTML = mealSelectHTML;
    consumedMealSelect.innerHTML = mealSelectHTML;
}

function displayMeals(meals) {
    const mealsContainer = document.getElementById('mealsContainer');
    mealsContainer.innerHTML = ''; // Clear previous content

    meals.forEach(meal => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal mb-4';
        const mealContent = `
            <h4 class="font-bold">${meal.name}</h4>
            <ul>
                ${meal.items.map(item => `<li>${item.itemName} - ${item.quantity} ${item.unit}</li>`).join('')}
            </ul>`;
        mealDiv.innerHTML = mealContent;
        mealsContainer.appendChild(mealDiv);
    });
}
function addMealToStock(mealId) {
    fetch('http://localhost:3000/meals/addToStock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mealId }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Meal added to stock:', data);
        // Optionally update the UI here to reflect the change
    })
    .catch(error => {
        console.error('Error adding meal to stock:', error);
        // Optionally update the UI to show an error message
    });
}