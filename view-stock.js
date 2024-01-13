document.addEventListener('DOMContentLoaded', () => {
    loadStockItems();

    const stockList = document.getElementById('stockList');
    if (stockList) {
        stockList.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-button')) {
                const row = event.target.parentElement.parentElement;
                const id = row.getAttribute('data-id');
                removeItem(id, row);
            }
        });
    }
});

function loadStockItems() {
    fetch('http://localhost:3000/items')
        .then(response => response.json())
        .then(items => items.forEach(item => addItemToTable(item)))
        .catch(error => console.error('Error fetching items:', error));
}

function addItemToTable(item) {
    const stockList = document.getElementById('stockList');
    const row = stockList.insertRow();
    row.setAttribute('data-id', item._id);
    const nameCell = row.insertCell(0);
    const quantityCell = row.insertCell(1);
    const actionsCell = row.insertCell(2);

    nameCell.textContent = item.name;
    quantityCell.textContent = `${item.quantity} ${item.unit}`; // Display quantity with unit

    const editButton = createButton('Edit', () => showEditItemModal(item, row));
    const removeButton = createButton('Remove', () => removeItem(item._id, row));

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(removeButton);
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'm-1');
    button.onclick = onClick;
    return button;
}

function removeItem(id, row) {
    fetch(`http://localhost:3000/items/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
        stockList.deleteRow(row.rowIndex);
    })
    .catch(error => console.error('Error:', error));
}

function showEditItemModal(item, row) {
    const newName = prompt('Enter new name', item.name);
    const newQuantity = prompt('Enter new quantity', item.quantity);
    const newUnit = prompt('Select a unit:', item.unit);

    console.log(`${newName}:${newQuantity}:${newUnit}`);
    const updatedItem = { ...item, name: newName, quantity: newQuantity, unit: newUnit };
    
    addOrUpdateItem(updatedItem, row); // Pass the updated item and row to the addOrUpdateItem function
}

function addOrUpdateItem(item, row) {
    const method = item._id ? 'PUT' : 'POST';
    const url = item._id ? `http://localhost:3000/items/${item._id}` : 'http://localhost:3000/items';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    })
    .then(response => response.json())
    .then(item => {
        // Update the row content with the updated data
        row.cells[0].textContent = item.name;
        row.cells[1].textContent = `${item.quantity} ${item.unit}`;
    })
    .catch(error => console.error('Error:', error));
}
