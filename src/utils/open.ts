import openInternal from 'open';
import { catchAsyncErrors } from './async';
import { unwrap } from './data';

function mapApp(app: string): string {
  if (app.startsWith('open ')) {
    app = app.trim().split(' ').pop() as string;
  }

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

/**
 * Opens the given app.
 */
export function openApp(
  app: string,
  options?: openInternal.OpenAppOptions,
): void {
  catchAsyncErrors(openInternal.openApp(mapApp(app), options));
}

/**
 * Opens the given value in either the default or a given app.
 */
export function open(
  value: any,
  app?: string,
  options?: openInternal.Options,
): void {
  if (value.uri) {
    value = value.uri;
  }

  value = unwrap(value);

  catchAsyncErrors(
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
