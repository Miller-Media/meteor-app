module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: 'xx.xx.xx.xx',
      username: 'ubuntu',
      pem: './meteor-backend.pem'
    }
  },

  app: {
    // TODO: change app name and path
    name: 'app',
    path: '../app',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'https://app.domain.com',
      MONGO_URL: 'mongodb://mongodb/meteor',
    },

    docker: {
      // change to 'abernix/meteord:base' if your app is using Meteor 1.4 - 1.5
      image: 'abernix/meteord:node-12-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  proxy: {
    domains: 'app.domain.com',
    ssl: {
      // Enable let's encrypt to create free certificates.
      // The email is used by Let's Encrypt to notify you when the
      // certificates are close to expiring.
      letsEncryptEmail: 'dev@miller-media.com',
      forceSSL: true,
    }
  }
};
