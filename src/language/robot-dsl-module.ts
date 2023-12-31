import type { DefaultSharedModuleContext, LangiumServices, LangiumSharedServices, Module, PartialLangiumServices } from 'langium';
import { createDefaultModule, createDefaultSharedModule, inject } from 'langium';
import { RobotDslGeneratedModule, RobotDslGeneratedSharedModule } from './generated/module.js';
import { RobotDslValidator, registerValidationChecks } from './robot-dsl-validator.js';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type RobotDslAddedServices = {
    validation: {
        RobotDslValidator: RobotDslValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type RobotDslServices = LangiumServices & RobotDslAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const RobotDslModule: Module<RobotDslServices, PartialLangiumServices & RobotDslAddedServices> = {
    validation: {
        RobotDslValidator: () => new RobotDslValidator()
    }
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createRobotDslServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    RobotDsl: RobotDslServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        RobotDslGeneratedSharedModule
    );
    const RobotDsl = inject(
        createDefaultModule({ shared }),
        RobotDslGeneratedModule,
        RobotDslModule
    );
    shared.ServiceRegistry.register(RobotDsl);
    registerValidationChecks(RobotDsl);
    return { shared, RobotDsl };
}
