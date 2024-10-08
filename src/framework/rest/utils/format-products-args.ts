import { Order, ProductQueryOptions } from '@/types';

export const formatProductsArgs = (options?: Partial<ProductQueryOptions>) => {
  // Destructure
  const {
    limit = 30,
    price,
    categories,
    name,
    searchType,
    searchQuery,
    text,
    ...restOptions
  } = options || {};

  return {
    limit,
    ...(price && { min_price: price as string }),
    ...(name && { name: name.toString() }),
    ...(categories && { categories: categories.toString() }),
    ...(searchType && { type: searchType.toString() }),
    ...(searchQuery && { name: searchQuery.toString() }),
    ...(text && { name: text.toString() }),
    ...restOptions,
  };
};

const defaultTranslateValue = ''
export function applyProductTranslations(product: any, language: string = "en"): any {
    const translations = product.translations || {};

    // Try to get the translation for the provided language
    const translation = translations[language];

    // Validate if the translation exists for the specified language
    if (translation) {
        product.name = translation.name || translations['en']?.name || defaultTranslateValue;
        product.description = translation.description || translations['en']?.description || defaultTranslateValue;
    } else {
        // Fallback to English translation or default if English doesn't exist
        product.name = translations['en']?.name || defaultTranslateValue;
        product.description = translations['en']?.description || defaultTranslateValue;
    }

    return product;
}

export function applyOrderTranslations(order: Order, language: string = "en"): any {
  return {
    ...order,  // Spread the original order properties
    products: order.products.map((product) => 
      applyProductTranslations(product, language)
    ),  // Create a new products array with translated products
  };
}