require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI,)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

// Item Schema and Model
const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    unit: String
});
const Item = mongoose.model('Item', itemSchema);

// Meal Schema and Model
const mealSchema = new mongoose.Schema({
    name: String,
    items: [{ itemName: String, quantity: Number, unit: String }]
});
const Meal = mongoose.model('Meal', mealSchema);


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

app.post('/meals', async (req, res) => {
    try {
        const { name, items } = req.body;
        // Additional validation can be added here
        const newMeal = new Meal({ name, items });

        console.log('Meal POSTEDD:', newMeal);

        await newMeal.save();

        res.status(201).json(newMeal);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create meal' });
    }
});


// Get all Meals
app.get('/meals', async (req, res) => {
    try {
        const meals = await Meal.find();
        res.json(meals);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch meals' });
    }
});

// Add Meal to Stock
app.post('/meals/addToStock', async (req, res) => {

    console.log("in app");

    try {
        const { mealId } = req.body;
        const meal = await Meal.findById(mealId);
        if (!meal) {
            return res.status(404).json({ error: 'Meal not found' });
        }

        // Iterate through each item in the meal and update the stock
        for (const mealItem of meal.items) {
            const item = await Item.findOne({ name: mealItem.itemName });
            if (item) {
                // Increase the stock quantity by the amount in the meal
                item.quantity += mealItem.quantity;
                await item.save();
            } else {
                // If item doesn't exist in stock, create a new one
                const newItem = new Item({
                    name: mealItem.itemName,
                    quantity: mealItem.quantity,
                    unit: mealItem.unit
                });
                await newItem.save();
            }
        }

        res.json({ message: 'Meal added to stock' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add meal to stock' });
    }
});

// Mark Meal as Consumed
app.post('/meals/markAsConsumed', async (req, res) => {
    try {
        const { mealId } = req.body;
        const meal = await Meal.findById(mealId);
        if (!meal) {
            return res.status(404).json({ error: 'Meal not found' });
        }

        // Iterate through each item in the meal and update the stock
        for (const mealItem of meal.items) {
            const item = await Item.findOne({ name: mealItem.itemName });
            if (item) {
                // Reduce the stock quantity by the amount used in the meal
                item.quantity -= mealItem.quantity;
                // Check for negative stock and handle accordingly
                if (item.quantity < 0) {
                    return res.status(400).json({ error: `Insufficient stock for item: ${mealItem.itemName}` });
                }
                await item.save();
            } else {
                // Handle the case where an item in the meal doesn't exist in the stock
                return res.status(404).json({ error: `Item not found in stock: ${mealItem.itemName}` });
            }
        }

        res.json({ message: 'Meal marked as consumed' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark meal as consumed' });
    }
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});