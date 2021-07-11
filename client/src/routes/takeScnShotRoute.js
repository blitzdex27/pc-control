import { Router } from 'express';
import takeScnShot from '../controllers/takeScnShot';

const router = new Router();

router.get('/', takeScnShot);

export default router;
