import { Router } from 'express';
// In a real app, we would import controllers here
// import { PatientController } from './controllers/PatientController';

const router = Router();

// Placeholder routes
router.get('/patients', (req, res) => {
    res.json({ message: "List patients" });
});

router.post('/patients', (req, res) => {
    // const controller = new PatientController();
    // controller.create(req, res);
    res.json({ message: "Create patient" });
});

router.post('/appointments', (req, res) => {
    res.json({ message: "Schedule appointment" });
});

export default router;
