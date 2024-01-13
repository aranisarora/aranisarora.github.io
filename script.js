document.addEventListener('DOMContentLoaded', () => {
    loadStockItems();

    document.getElementById('addItem').addEventListener('click', () => {
        const name = document.getElementById('itemName').value.trim();
        const quantity = document.getElementById('itemQuantity').value.trim();
        if (name && quantity) {
            addOrUpdateItem({ name, quantity });
            clearInputFields();
        } else {
            alert('Please fill in all fields');
        }
    });
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
    quantityCell.textContent = item.quantity;

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

function addOrUpdateItem(item, rowToUpdate = null) {
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
    .then(data => {
        if (rowToUpdate) {
            updateRow(rowToUpdate, data);
        } else {
            addItemToTable(data);
        }
    })
    .catch(error => console.error('Error:', error));
}

function removeItem(id, row) {
    fetch(`http://localhost:3000/items/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
        row.remove(); // directly remove the row
    })
    .catch(error => console.error('Error:', error));
}

function showEditItemModal(item, row) {
    // This function should create a modal or form to edit the item
    // For simplicity, using prompt
    const newName = prompt('Enter new name', item.name);
    const newQuantity = prompt('Enter new quantity', item.quantity);

    if (newName && newQuantity) {
        addOrUpdateItem({ ...item, name: newName, quantity: newQuantity }, row);
    }
}

function updateRow(row, item) {
    row.cells[0].textContent = item.name;
    row.cells[1].textContent = item.quantity;
}

function clearInputFields() {
    document.getElementById('itemName').value = '';
    document.getElementById('itemQuantity').value = '';
}
