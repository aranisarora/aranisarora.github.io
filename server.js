// Server.js (with MongoDB integration)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using your MongoDB Atlas connection string
mongoose.connect("mongodb+srv://Test:pass@stockmanager.8re0unt.mongodb.net/?retryWrites=true&w=majority",)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Define the item schema and model
const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    unit: {
        type: String,
        default: 'kg', // Set a default value if needed
        require: true
    }
});

const Item = mongoose.model('Item', itemSchema);

// Create a new item
app.post('/items', async (req, res) => {
    try {
        const { name, quantity, unit } = req.body; // Include unit in the request body
        const newItem = new Item({ name, quantity, unit }); // Store unit in the database
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// Get all items
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// Edit (Update) an item by ID
app.put('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const { name, quantity, unit } = req.body;
        const updatedItem = await Item.findByIdAndUpdate(itemId, { name, quantity, unit }, { new: true });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// Delete an item by ID
app.delete('/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        await Item.findByIdAndDelete(itemId);
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
