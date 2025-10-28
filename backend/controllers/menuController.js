import MenuItem from '../models/MenuItem.js';

// @desc    Fetch all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({});
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res) => {
    const { name, description, price, category, image } = req.body;

    const menuItem = new MenuItem({
        name,
        description,
        price,
        category,
        image,
    });

    const createdMenuItem = await menuItem.save();
    res.status(201).json(createdMenuItem);
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (menuItem) {
        await MenuItem.deleteOne({ _id: menuItem._id });
        res.json({ message: 'Menu item removed' });
    } else {
        res.status(404).json({ message: 'Menu item not found' });
    }
};

export { getMenuItems, createMenuItem, deleteMenuItem };
