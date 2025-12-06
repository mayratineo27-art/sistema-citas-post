import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";
import { Result, ok, fail } from "../common/Result";
import { LoginUserDTO } from "../dtos/LoginUserDTO";

export class LoginUser {
    constructor(private userRepository: UserRepository) { }

    async execute(dto: LoginUserDTO): Promise<Result<User>> {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            return fail("User not found");
        }
        // In a real app, verify password here
        return ok(user);
    }
}
