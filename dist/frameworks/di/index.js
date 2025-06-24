"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyInjection = void 0;
const repository_registry_1 = require("./repository.registry");
const useCase_registry_1 = require("./useCase.registry");
class DependencyInjection {
    static registerAll() {
        useCase_registry_1.UseCaseRegistry.registerUseCase();
        repository_registry_1.RepositoryRegistry.registerRepositories();
    }
}
exports.DependencyInjection = DependencyInjection;
//# sourceMappingURL=index.js.map