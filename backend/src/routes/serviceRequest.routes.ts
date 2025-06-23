import { Router } from 'express';
import { createServiceRequest } from '../controllers/serviceRequest.controller';

const router = Router();

router.post('/', createServiceRequest);

export default router; 