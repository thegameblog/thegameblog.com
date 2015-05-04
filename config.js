var path = require('path');
var env = require('node-env-file');

// Pull from local .env file if it exists
env(path.join(__dirname, '.env'), {overwrite: true, raise: false});

var database;
if (process.env.DATABASE_URL) {
  database = {
    client: 'pg',
    connection: process.env.DATABASE_URL
  };
} else {
  database = {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, '/content/data/ghost-dev.db')
    }
  };
}

var mail = {};
if (process.env.MANDRILL_USERNAME) {
  mail = {
    transport: 'SMTP',
    options: {
      service: 'Mandrill',
      auth: {
        user: process.env.MANDRILL_USERNAME,
        pass: process.env.MANDRILL_APIKEY
      }
    }
  };
}

var storage;
if (process.env.S3_BUCKET) {
  storage = {
    active: 's3',
    s3: {
      bucket: process.env.S3_BUCKET,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
  };
} else if (process.env.CLOUDINARY_URL) {
  storage = {
    active: 'cloudinary'
  };
}

module.exports = {
  production: {
    url: process.env.SITE_URL,
    mail: mail,
    database: database,
    storage: storage,
    fileStorage: !!storage,
    server: {
      host: process.env.HOST || '0.0.0.0',
      port: process.env.PORT || '2368'
    },
    paths: {
      contentPath: path.join(__dirname, '/content/')
    }
  },
  development: {
    url: process.env.SITE_URL || 'http://localhost',
    mail: mail,
    database: database,
    storage: storage,
    fileStorage: !!storage,
    server: {
      host: process.env.HOST || 'localhost',
      port: process.env.PORT || '2368'
    },
    paths: {
      contentPath: path.join(__dirname, '/content/')
    }
  }
};
