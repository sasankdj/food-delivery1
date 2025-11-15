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
    const { name, description, price, category, image } = req.body;

    if (!name || !description || !price || !category) {
        res.status(400);
        throw new Error('Please provide all required fields: name, description, price, category');
    }

    const menuItem = new MenuItem({ name, description, price, category, image });
    const createdMenuItem = await menuItem.save();
    if (createdMenuItem) {
        res.status(201).json(createdMenuItem);
    } else {
        res.status(400);
        throw new Error('Invalid menu item data');
    }
});

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
        await menuItem.deleteOne();
        res.json({ message: 'Menu item removed' });
    } else {
        res.status(404);
        throw new Error('Menu item not found');
    }
});

export { getMenuItems, createMenuItem, deleteMenuItem };