import Module from 'module';

const ModuleGeneric = Module as any;

// eslint-disable-next-line no-underscore-dangle
const originalLoad = ModuleGeneric._load.bind(ModuleGeneric);

function createLazyModuleProperty(
  prop: string,
  getActualModuleProperty: () => any,
) {
  return new Proxy<Record<string, any>>(() => {}, {
    apply(_, thisArg, argArray) {
      return getActualModuleProperty().apply(thisArg, argArray);
    },
    construct(_, argArray) {
      const actual = getActualModuleProperty();

      // eslint-disable-next-line new-cap
      return new actual(...argArray);
    },
    getPrototypeOf(_) {
      return getActualModuleProperty().prototype;
    },
    ownKeys(_) {
      return Reflect.ownKeys(getActualModuleProperty());
    },
    get(_, prop) {
      return getActualModuleProperty()[prop];
    },
    has(_, prop) {
      return prop in getActualModuleProperty();
    },
  });
}

function createLazyModule(getActualModule: () => any) {
  return new Proxy<Record<string, any>>(
    {},
    {
      get(target, prop) {
        if (prop in target) {
          return (target as any)[prop];
        }

        // Intercept all
        if (typeof prop === 'string') {
          const firstLetterCode = prop.charCodeAt(0);
          const isUpperCase = firstLetterCode >= 65 && firstLetterCode <= 90;
          if (!isUpperCase) {
            return createLazyModuleProperty(prop, () => {
              if (prop in target) {
                return (target as any)[prop];
              }

              const value = getActualModule()[prop];

              // Remember property for later
              target[prop] = value;

              return value;
            });
          }
        }

        const value = getActualModule()[prop];

        // Remember property for later
        target[prop as any] = value;

        return value;
      },
      has(target, prop) {
        // If there is a check which properties are there, we have to load the full module
        return prop in target || prop in getActualModule();
      },
      ownKeys(_) {
        // If keys get enumerated, we have to load the full module
        return Reflect.ownKeys(getActualModule());
      },
    },
  );
}

if (originalLoad) {
  // eslint-disable-next-line no-underscore-dangle,func-names
  ModuleGeneric._load = function (
    request: string,
    parent: Module,
    ...args: any[]
  ) {
    const isProjectModule =
      (request.startsWith('.') || request.startsWith('#')) &&
      !request.includes('node_modules') &&
      !parent.path.includes('node_modules');
    const isLazyModule = isProjectModule && request.includes('/utils/');
    if (isLazyModule) {
      return createLazyModule(() => originalLoad(request, parent, ...args));
    }

    return originalLoad(request, parent, ...args);
  };
}
