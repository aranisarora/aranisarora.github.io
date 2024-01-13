document.getElementById('addItemForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const itemName = document.getElementById('itemName').value;
    const itemQuantity = document.getElementById('itemQuantity').value;

    // API request to the backend to add an item
    fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: itemName, quantity: itemQuantity }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Reload items
        loadItems();
    })
    .catch(error => console.error('Error:', error));
});

function loadItems() {
    fetch('http://localhost:3000/items')
        .then(response => response.json())
        .then(items => {
            const itemsDiv = document.getElementById('stockItems');
            itemsDiv.innerHTML = '';
            items.forEach(item => {
                itemsDiv.innerHTML += `<p>${item.name}: ${item.quantity}</p>`;
            });
        });
}

// Load items on page load
window.onload = loadItems;
