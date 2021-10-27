import { Wrapper } from '../data/wrapper';
import openInternal from 'open';
import { awaitSync } from '../utils/async';

function mapApp(app: string): string {
  switch (app) {
    case 'chrome':
      return openInternal.apps.chrome as string;
    case 'firefox':
      return openInternal.apps.firefox as string;
    case 'edge':
      return openInternal.apps.edge as string;
    case 'vscode':
    case 'code':
      return 'visual studio code';
    default:
      return app;
  }
}

export function openApp(
  app: string,
  options?: openInternal.OpenAppOptions,
): void {
  awaitSync(openInternal.openApp(mapApp(app), options));
}

export function open(
  value: any,
  app?: string,
  options?: openInternal.Options,
): void {
  if (value.uri) {
    value = value.uri;
  }

  if (value instanceof Wrapper) {
    value = value.value;
  }

  awaitSync(
    openInternal(value, {
      ...options,
      ...(app
        ? {
            app: {
              name: mapApp(app),
            },
          }
        : {}),
    }),
  );
}
