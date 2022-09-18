module.exports = {
  options: {
    exclude: {
      path: 'apidoc-json|docs|node_modules|lib|common|spec|test|^[a-zA-Z0-9\\_]+$',
    },
    reporterOptions: {
      dot: {
        collapsePattern: '^src/modules/[^/]+',
        theme: {
          edge: {
            color: '#222222',
            penwidth: 1,
          },
          modules: [
            {
              criteria: { source: 'modules' },
              attributes: {
                shape: 'box',
                style: 'rounded, filled',
              },
            },
          ],
        },
      },
    },
  },
};
// generated: dependency-cruiser@8.2.0 on 2020-04-22T22:19:31.387Z
