import Contact from '../models/Contact.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    const contact = new Contact({
        name,
        email,
        message,
    });

    const createdContact = await contact.save();
    res.status(201).json(createdContact);
});

export { submitContactForm };
