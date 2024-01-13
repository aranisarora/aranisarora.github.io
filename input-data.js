document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('addItem').addEventListener('click', () => {
        const name = document.getElementById('itemName').value.trim();
        const quantity = document.getElementById('itemQuantity').value.trim();
        const unit = document.getElementById('itemUnit').value; // Get selected unit
        console.log(unit);
        if (name && quantity && unit) {
            addOrUpdateItem({ name, quantity, unit }); // Include unit
            clearInputFields();
        } else {
            alert('Please fill in all fields');
        }
    });
});
function addOrUpdateItem(item) {
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
        .catch(error => console.error('Error:', error));
}


function clearInputFields() {
    document.getElementById('itemName').value = '';
    document.getElementById('itemQuantity').value = '';
    document.getElementById('itemUnit').value = 'kg'; // Reset unit to default
}
