import express from 'express';
import { getMenuItems, createMenuItem, deleteMenuItem } from '../controllers/menuController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/').get(getMenuItems).post(protect, admin, createMenuItem);
router.route('/:id').delete(protect, admin, deleteMenuItem);

export default router;