import path from 'path';
import express from 'express';
import multer from 'multer';

import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

router.post('/', protect, admin, upload.single('image'), (req, res) => {
    // req.file is the `image` file
    // The path is constructed to be served statically
    res.send({ message: 'Image Uploaded', image: `/${req.file.path.replace(/\\/g, "/")}` });
});

export default router;