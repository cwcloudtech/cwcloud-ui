import counterpart from 'counterpart';

import { englishLanguage, frenchLanguage } from '../Context/Language';
import localStorageService from "./localStorageService";

counterpart.registerTranslations('en', englishLanguage);
counterpart.registerTranslations('fr', frenchLanguage);
counterpart.setLocale(localStorageService.getLanguage());

export default counterpart;
