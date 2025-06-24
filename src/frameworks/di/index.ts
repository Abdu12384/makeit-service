import { RepositoryRegistry } from "./repository.registry";
import { UseCaseRegistry } from "./useCase.registry";

export class DependencyInjection{
    static registerAll(): void{
       UseCaseRegistry.registerUseCase()
       RepositoryRegistry.registerRepositories();
    }
}