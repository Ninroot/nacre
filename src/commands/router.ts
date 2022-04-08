'use strict';

const router: any = {};
const routes = {};

router.add = (path, handler) => {
  // console.debug('Add handler on path', path);
  routes[path] = handler;
};

router.dispatch = () => {
  // console.debug('arv2', process.argv[2]);
  const json = JSON.parse(process.argv[2] || '');

  // console.debug({ json });
  const res: any = {};
  res.success = (resBody) => {
    process.stdout.write(JSON.stringify(resBody));
  };
  res.error = (resBody) => {
    process.stderr.write(resBody.stack);
  };
  routes[json.endpoint](json.body, res);
};

export = router;
