import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserRepository } from '../supabase/UserRepository';

const router = Router();

// Dependencies
const userRepository = new UserRepository();
const authController = new AuthController(userRepository);

// Auth Routes
router.post('/auth/login', (req, res) => authController.login(req, res));

// Patient Routes (Placeholder)
router.get('/patients', (req, res) => { res.json({ msg: "List patients" }) });

// Doctor Routes (Placeholder)
router.get('/doctors', (req, res) => { res.json({ msg: "List doctors" }) });

export default router;
