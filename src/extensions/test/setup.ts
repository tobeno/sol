import { sol } from '../../sol';

sol.registerGlobals({
  test: {
    value() {
      console.log('Hello from test extension!');
    },
  },
});
