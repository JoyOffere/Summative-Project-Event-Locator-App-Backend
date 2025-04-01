const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const path = require('path');
const fs = require('fs');

// Load language resources
const loadResources = () => {
  const resources = {};
  const langPath = path.join(__dirname, '../locales');
  
  fs.readdirSync(langPath).forEach(file => {
    if (file.endsWith('.json')) {
      const langCode = file.split('.')[0];
      resources[langCode] = {
        translation: require(path.join(langPath, file))
      };
    }
  });
  
  return resources;
};

// Initialize i18next
i18next
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    resources: loadResources(),
    fallbackLng: 'en',
    preload: ['en', 'es', 'fr'],
    detection: {
      order: ['querystring', 'cookie', 'header'],
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      lookupHeader: 'accept-language',
      caches: ['cookie']
    },
    interpolation: {
      escapeValue: false
    }
  });

module.exports = {
  i18next,
  i18nextMiddleware
};