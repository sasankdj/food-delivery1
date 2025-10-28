import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['South Indian', 'North Indian', 'Chinese'],
    },
    image: {
        type: String, // URL to the image
        required: true,
    },
}, { timestamps: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;