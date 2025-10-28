import Contact from '../models/Contact.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const contact = new Contact({
            name,
            email,
            message,
        });

        const createdContact = await contact.save();
        res.status(201).json(createdContact);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { submitContactForm };
