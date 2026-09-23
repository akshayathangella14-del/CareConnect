const env = require('../config/env');

const formatMeta = (meta) => {
  if (!meta) {
    return '';
  }

  if (meta instanceof Error) {
    return ` ${meta.message}`;
  }

  return ` ${JSON.stringify(meta)}`;
};

const logger = {
  info(message, meta) {
    console.info(`[info] ${message}${formatMeta(meta)}`);
  },

  warn(message, meta) {
    console.warn(`[warn] ${message}${formatMeta(meta)}`);
  },

  error(message, meta) {
    console.error(`[error] ${message}${formatMeta(meta)}`);
  },

  debug(message, meta) {
    if (env.isDevelopment || env.isTest) {
      console.debug(`[debug] ${message}${formatMeta(meta)}`);
    }
  },
};

module.exports = logger;
