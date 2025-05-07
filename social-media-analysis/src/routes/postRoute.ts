import express from 'express';
import { getPosts } from '../controllers/latestPostController';

const router = express.Router();

router.get('/', getPosts);

export default router;
