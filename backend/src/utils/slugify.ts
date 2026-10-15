import slugifyLib from 'slugify';

export const makeSlug = (text: string): string => {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    locale: 'ru',
    trim: true,
  });
};

export const makeUniqueSlug = async (
  baseText: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
  const base = makeSlug(baseText);
  let slug = base;
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
};