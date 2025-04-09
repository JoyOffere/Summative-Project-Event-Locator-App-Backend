import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

// src/i18n.js

i18next
    .use(HttpBackend) // Load translations from backend or local files
    .use(LanguageDetector) // Detect user's language
    .use(initReactI18next) // Integrate with React
    .init({
        fallbackLng: 'en',
        supportedLngs: ['en', 'fr'],
        backend: {
            loadPath: '/locales/{{lng}}/translation.json', // Adjust if serving from backend
        },
        interpolation: {
            escapeValue: false, // React already escapes
        },
    });

export default i18next;