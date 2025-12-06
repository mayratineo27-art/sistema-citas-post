import { Request, Response } from 'express';
import { LoginUser } from '../../application/use-cases/LoginUser';
import { UserRepository } from '../../domain/repositories/UserRepository';

// Dependency injection would be better suited here in a real app
export class AuthController {
    constructor(private userRepository: UserRepository) { }

    async login(req: Request, res: Response) {
        const { email } = req.body; // In real app, password too
        const useCase = new LoginUser(this.userRepository);

        const result = await useCase.execute({ email });

        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(401).json({ error: result.error });
        }
    }
}
