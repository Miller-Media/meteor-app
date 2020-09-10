module.exports = {
  
  servers: {
    one: {
      host: 'xx.xx.xx.xx', // staging IP
      username: 'ubuntu',
      pem: './meteor-backend.pem'
    }
  },

  app: {
    name: 'app',
    path: '../../app',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      ROOT_URL: 'https://staging.app.domain.com', // staging URL
      MONGO_URL: 'mongodb://mongodb/meteor',
    },

    docker: {
      image: 'abernix/meteord:node-12-base',
    },

    enableUploadProgressBar: true
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  },

  proxy: {
    domains: 'staging.app.domain.com', // staging domain
    ssl: {
      letsEncryptEmail: 'dev@miller-media.com',
      forceSSL: true,
    }
  }
};
