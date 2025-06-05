import { RepositoryRegistry } from "./repository.registry.js";
import { UseCaseRegistry } from "./useCase.registry.js";
export class DependencyInjection {
    static registerAll() {
        UseCaseRegistry.registerUseCase();
        RepositoryRegistry.registerRepositories();
    }
}
//# sourceMappingURL=index.js.map