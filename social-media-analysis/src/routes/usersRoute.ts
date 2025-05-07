import express from 'express';
import { getTopUsersByComments } from '../controllers/topUsersController';

const router = express.Router();

router.get('/', getTopUsersByComments);

export default router;