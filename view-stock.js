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
        .then(items => items.forEach((item, index) => addItemToTable(item, index)))
        .catch(error => console.error('Error fetching items:', error));
}

function addItemToTable(item, index) {
    const stockList = document.getElementById('stockList');
    const row = stockList.insertRow();
    row.setAttribute('data-id', item._id);
    row.classList.add('border-b');

    const itemNoCell = row.insertCell(0);
    itemNoCell.textContent = index + 1;
    itemNoCell.classList.add('border', 'px-4', 'py-2');

    const nameCell = row.insertCell(1);
    nameCell.classList.add('border', 'px-4', 'py-2');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = item.name;
    nameInput.disabled = true;
    nameInput.classList.add('rounded', 'px-2', 'py-1');
    nameCell.appendChild(nameInput);

    const quantityCell = row.insertCell(2);
    quantityCell.classList.add('border', 'px-4', 'py-2');
    const combinedQuantityUnitInput = document.createElement('input');
    combinedQuantityUnitInput.type = 'text';
    combinedQuantityUnitInput.value = `${item.quantity} ${item.unit}`;
    combinedQuantityUnitInput.disabled = true;
    combinedQuantityUnitInput.classList.add('rounded', 'px-2', 'py-1');
    quantityCell.appendChild(combinedQuantityUnitInput);

    const actionsCell = row.insertCell(3);
    actionsCell.classList.add('border', 'px-4', 'py-2');
    const editButton = createButton('Edit', 'edit-button');
    const removeButton = createButton('Remove', 'remove-button');
    const cancelButton = createButton('Cancel', 'cancel-button');
    cancelButton.style.display = 'none';
    const saveButton = createButton('Save', 'save-button');
    saveButton.style.display = 'none';
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
    const nameInput = row.cells[1].querySelector('input');
    const combinedQuantityUnitInput = row.cells[2].querySelector('input');
    const editButton = row.cells[3].querySelector('.edit-button');
    const cancelButton = row.cells[3].querySelector('.cancel-button');
    const saveButton = row.cells[3].querySelector('.save-button');

    nameInput.disabled = false;
    combinedQuantityUnitInput.disabled = false;
    editButton.style.display = 'none';
    saveButton.style.display = 'inline-block';
    cancelButton.style.display = 'inline-block';

    nameInput.focus();
}

function cancelEdit(row) {
    const nameInput = row.cells[1].querySelector('input');
    const combinedQuantityUnitInput = row.cells[2].querySelector('input');
    const editButton = row.cells[3].querySelector('.edit-button');
    const cancelButton = row.cells[3].querySelector('.cancel-button');
    const saveButton = row.cells[3].querySelector('.save-button');

    nameInput.value = row.originalData.name;
    combinedQuantityUnitInput.value = `${row.originalData.quantity} ${row.originalData.unit}`;

    nameInput.disabled = true;
    combinedQuantityUnitInput.disabled = true;
    editButton.style.display = 'inline-block';
    saveButton.style.display = 'none';
    cancelButton.style.display = 'none';
}

function saveItem(row) {
    const nameInput = row.cells[1].querySelector('input');
    const combinedQuantityUnitInput = row.cells[2].querySelector('input');
    const combinedQuantityUnit = combinedQuantityUnitInput.value.trim().split(" ");
    const editButton = row.cells[3].querySelector('.edit-button');
    const cancelButton = row.cells[3].querySelector('.cancel-button');
    const saveButton = row.cells[3].querySelector('.save-button');

    if (combinedQuantityUnit.length != 2) {
        alert('Please enter quantity and unit in the format "100 Kgs".');
        return;
    }

    const updatedItem = {
        name: nameInput.value.trim(),
        quantity: combinedQuantityUnit[0],
        unit: combinedQuantityUnit[1],
    };

    const id = row.getAttribute('data-id');
    fetch(`http://localhost:3000/items/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
    })
    .then(response => response.json())
    .then(item => {
        row.originalData = item;

        nameInput.value = item.name;
        combinedQuantityUnitInput.value = `${item.quantity} ${item.unit}`;

        nameInput.disabled = true;
        combinedQuantityUnitInput.disabled = true;
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
