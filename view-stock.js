document.addEventListener('DOMContentLoaded', () => {
    loadStockItems();

    const stockList = document.getElementById('stockList');
    if (stockList) {
        stockList.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-button')) {
                const row = event.target.parentElement.parentElement;
                const id = row.getAttribute('data-id');
                removeItem(id, row);
            } else if (event.target.classList.contains('edit-button')) {
                const row = event.target.parentElement.parentElement;
                editItem(row);
            } else if (event.target.classList.contains('cancel-button')) {
                const row = event.target.parentElement.parentElement;
                cancelEdit(row);
            } else if (event.target.classList.contains('save-button')) {
                const row = event.target.parentElement.parentElement;
                saveItem(row);
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
    const unitCell = row.insertCell(2);
    const actionsCell = row.insertCell(3);

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = item.name;
    nameInput.disabled = true;
    nameInput.classList.add('rounded', 'px-2', 'py-1');

    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.value = item.quantity;
    quantityInput.disabled = true;
    quantityInput.classList.add('rounded', 'px-2', 'py-1');
    
    const unitInput = document.createElement('input');
    unitInput.type = 'text';
    unitInput.value = item.unit;
    unitInput.disabled = true;
    unitInput.classList.add('rounded', 'px-2', 'py-1');

    nameCell.appendChild(nameInput);
    quantityCell.appendChild(quantityInput);
    unitCell.appendChild(unitInput);

    const editButton = createButton('Edit', 'edit-button');
    const removeButton = createButton('Remove', 'remove-button');
    const cancelButton = createButton('Cancel', 'cancel-button');
    cancelButton.style.display = 'none'; // Initially hide cancel button
    const saveButton = createButton('Save', 'save-button');
    saveButton.style.display = 'none'; // Initially hide save button

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(removeButton);
    actionsCell.appendChild(cancelButton);
    actionsCell.appendChild(saveButton);
}

function createButton(text, className) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-1', 'px-2', 'rounded', 'm-1', className);
    return button;
}

function editItem(row) {
    const nameInput = row.cells[0].querySelector('input');
    const quantityInput = row.cells[1].querySelector('input');
    const unitInput = row.cells[2].querySelector('input');
    const editButton = row.cells[3].querySelector('.edit-button');
    const cancelButton = row.cells[3].querySelector('.cancel-button');
    const saveButton = row.cells[3].querySelector('.save-button');

    // Save the original values
    const originalName = nameInput.value;
    const originalQuantity = quantityInput.value;
    const originalUnit = unitInput.value;

    nameInput.disabled = false;
    quantityInput.disabled = false;
    unitInput.disabled = false;
    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
    cancelButton.style.display = 'inline-block';

    // Auto-select the first input field
    nameInput.focus();
}

function cancelEdit(row) {
    const nameInput = row.cells[0].querySelector('input');
    const quantityInput = row.cells[1].querySelector('input');
    const unitInput = row.cells[2].querySelector('input');
    const editButton = row.cells[3].querySelector('.edit-button');
    const cancelButton = row.cells[3].querySelector('.cancel-button');
    const saveButton = row.cells[3].querySelector('.save-button');

    // Revert to original values
    nameInput.value = originalName;
    quantityInput.value = originalQuantity;
    unitInput.value = originalUnit;

    nameInput.disabled = true;
    quantityInput.disabled = true;
    unitInput.disabled = true;
    editButton.style.display = 'inline-block';
    saveButton.style.display = 'none';
    cancelButton.style.display = 'none';
}

function saveItem(row) {
    const nameInput = row.cells[0].querySelector('input');
    const quantityInput = row.cells[1].querySelector('input');
    const unitInput = row.cells[2].querySelector('input');
    const editButton = row.cells[3].querySelector('.edit-button');
    const cancelButton = row.cells[3].querySelector('.cancel-button');
    const saveButton = row.cells[3].querySelector('.save-button');

    const newName = nameInput.value.trim();
    const newQuantity = quantityInput.value.trim();
    const newUnit = unitInput.value.trim();

    if (!newName || !newQuantity || !newUnit) {
        // Prevent saving if any field is empty
        alert('Name, Quantity, and Unit cannot be empty.');
        return;
    }

    const id = row.getAttribute('data-id');
    const updatedItem = {
        name: newName,
        quantity: newQuantity,
        unit: newUnit,
    };

    fetch(`http://localhost:3000/items/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
    })
    .then(response => response.json())
    .then(item => {
        // Update the row content with the updated data
        nameInput.value = item.name;
        quantityInput.value = item.quantity;
        unitInput.value = item.unit;

        nameInput.disabled = true;
        quantityInput.disabled = true;
        unitInput.disabled = true;
        editButton.style.display = 'inline-block';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
    })
    .catch(error => console.error('Error:', error));
}

function removeItem(id, row) {
    fetch(`http://localhost:3000/items/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
        row.remove();
    })
    .catch(error => console.error('Error:', error));
}
