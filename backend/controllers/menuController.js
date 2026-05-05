import MenuItem from '../models/MenuItem.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Fetch all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = asyncHandler(async (req, res) => {
    const menuItems = await MenuItem.find({});
    res.json(menuItems);
});

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = asyncHandler(async (req, res) => {
    const { name, description, price, category, image, ingredients, calories } = req.body;

    const menuItem = new MenuItem({
        name,
        description,
        price,
        category,
        image: image,
        ingredients,
        calories,
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);
});

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
        await MenuItem.deleteOne({ _id: menuItem._id });
        res.json({ message: 'Menu item removed' });
    } else {
        res.status(404);
        throw new Error('Menu item not found');
    }
});

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
        menuItem.name = req.body.name || menuItem.name;
        menuItem.description = req.body.description || menuItem.description;
        menuItem.price = req.body.price || menuItem.price;
        menuItem.category = req.body.category || menuItem.category;
        menuItem.image = req.body.image || menuItem.image;
        menuItem.ingredients = req.body.ingredients || menuItem.ingredients;
        menuItem.calories = req.body.calories || menuItem.calories;

        const updatedMenuItem = await menuItem.save();
        res.json(updatedMenuItem);
    } else {
        res.status(404);
        throw new Error('Menu item not found');
    }
});

export { getMenuItems, createMenuItem, deleteMenuItem, updateMenuItem };
