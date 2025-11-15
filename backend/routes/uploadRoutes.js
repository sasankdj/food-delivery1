import express from 'express';
import multer from 'multer';
import fs from 'fs';

import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    res.send({ message: 'Image Uploaded', image: dataUrl });
});

export default router;
