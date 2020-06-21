import { sol } from '../../sol';

sol.registerGlobals({
  test() {
    console.log('Hello from test extension!');
  },
});
