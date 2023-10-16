const { server } = require('@hapi/hapi');
const { routes } = require('./routes');

const init = async () => {
  const newServer = server({
    port: 8000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  newServer.route(routes);

  await newServer.start();
  console.log(`server running at ${newServer.info.uri}`);
};

init().then((r) => r);
