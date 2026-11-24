import React, { useEffect, useState } from 'react';
import counterpart from 'counterpart';

// Drop-in replacement for react-translate-component, based on counterpart.
// Re-renders on locale change and supports the `with` interpolations
// (e.g. <Translate content="key" with={{ status }} />) and `attributes`
// (e.g. attributes={{ placeholder: "key" }}).
const Translate = ({
  content,
  with: interpolations,
  component: Component = 'span',
  locale,
  scope,
  count,
  fallback,
  attributes,
  unsafe,
  children,
  ...props
}) => {
  const [currentLocale, setCurrentLocale] = useState(() => counterpart.getLocale());

  useEffect(() => {
    if (locale) return undefined;
    const onLocaleChange = (newLocale) => setCurrentLocale(newLocale);
    counterpart.onLocaleChange(onLocaleChange);
    return () => counterpart.offLocaleChange(onLocaleChange);
  }, [locale]);

  const options = {
    locale: locale || currentLocale,
    scope,
    count,
    fallback,
    ...interpolations,
  };

  const translatedAttributes = {};
  if (attributes) {
    Object.entries(attributes).forEach(([name, key]) => {
      if (key) translatedAttributes[name] = counterpart.translate(key, options);
    });
  }

  return (
    <Component {...props} {...translatedAttributes}>
      {content ? counterpart.translate(content, options) : children}
    </Component>
  );
};

export default Translate;
