import { RepositoryRegistry } from "./repository.registry.js";
import { UseCaseRegistry } from "./useCase.registry.js";

export class DependencyInjection{
    static registerAll(): void{
       UseCaseRegistry.registerUseCase()
       RepositoryRegistry.registerRepositories();
    }
}