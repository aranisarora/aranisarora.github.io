document.addEventListener('DOMContentLoaded', () => {
    const createMealForm = document.getElementById('createMealForm');
    const newMealNameInput = document.getElementById('newMealName');

    const addMealItemBtn = document.getElementById('addItem');
    const consumeItemBtn = document.getElementById('consumeItem');


    /*
    addMealToStockBtn.addEventListener('click', () => {
        const selectedMealId = mealSelect.value;
        addMealToStock(selectedMealId);
    });
    */
    

    //////////CHANGE THIS TO ADD ITEM TO STOCK
    addMealItemBtn.addEventListener('click', () => {
        addItemToStock();
    });

    consumeItemBtn.addEventListener('click', () => {
        consumeItem(selectedMealId);
    });
});

function clearMealCreationForm() {
    document.getElementById('newMealName').value = '';
    document.getElementById('mealItemsContainer').innerHTML = ''; // Clear the meal items
}

function addItemToStock() {

    console.log("Add");

    fetch('/meals/addToStock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({  }),
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
function consumeItem(mealId) {
    console.log("Consume");

    fetch(`/meals/markAsConsumed`, {
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