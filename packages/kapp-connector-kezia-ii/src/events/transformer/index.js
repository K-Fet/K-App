const stringSimilarity = require('string-similarity');
const { parse } = require('date-fns');
const kAppApi = require('../../k-app-api');

const MATCH_THRESHOLD = +process.env.PRODUCTS_MATCH_THRESHOLD || 0.5;
const DATE_FORMAT = 'yyyy-MM dd:HH:mm:sss';

function normalizeName(name) {
  return name
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Create an mapping object between Kezia articles and K-App products
 *
 * @param data {any[]} Read data
 * @param products {any[]} K-App products
 * @return {Map} A map matching Kezia articles and K-App products
 */
function createProductMap(data, products) {
  if (!products.length || !data.length) return null;

  // Compute unique articles by id with their names
  const articles = new Map(data.map(({ IDART, DEF }) => [IDART, DEF]));

  // Used to only have one match per product
  const usedProducts = new Set();

  return new Map(
    Array
      .from(articles)
      // Create a cross join array with string similarity for each pairs
      .map(([idart, def]) => products.map(({ _id, name }) => ({
        article: def,
        articleId: idart,
        product: name,
        productId: _id,
        // TODO Find a better comparison algorithm
        //  In order to improve rating for simple mistakes like 'mikl' instead of 'milk'
        similarity: stringSimilarity.compareTwoStrings(normalizeName(def), normalizeName(name)),
      })))
      // Flatten array (flatMap not available yet)
      .reduce((acc, el) => acc.concat(el), [])
      // Sort by best match
      .sort((a, b) => b.similarity - a.similarity)
      // Remove unrelated pairs
      .filter(o => o.similarity > MATCH_THRESHOLD)
      // Keep only the best rated pair
      .filter((o) => {
        if (usedProducts.has(o.productId)) return false;
        usedProducts.add(o.productId);
        return true;
      })
      .map(r => [r.articleId, r.productId]),
  );
}

/**
 * Transform a HyperFile date to a js date.
 *
 * @param DATE
 * @return {never}
 */
function getDate(DATE) {
  if (!DATE) return null;
  return parse(DATE.substring(4).replace('.', ':'), DATE_FORMAT, new Date());
}

/**
 * Transform KeziaII data into K-App compatible data.
 *
 * @param data {any[]}
 * @returns {Promise<any[]>}
 */
async function transform(data) {
  const products = await kAppApi.getAllProducts();

  const productMap = createProductMap(data, products);
  console.log('Product - article map', productMap);

  return data.map(({ DATE, IDART, Q_VAR }) => ({
    product: productMap.get(IDART),
    diff: Q_VAR,
    type: 'Transaction',
    date: getDate(DATE),
    meta: `IDART:${IDART}`,
  })).filter(e => !!e.product);
}


module.exports = {
  transform,
};
