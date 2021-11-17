'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const createCartItem = async (item) => {
  const entity = await strapi.query('cart-items').create(item);
  return entity.id
}

module.exports = {

  create: async (stripeSession, products, checkout) => {
    // await strapi.query('line_items').create(products);
    let cart_items = await Promise.all(products.map(async (product) => {
      const count = product.count
      return await createCartItem({product,count})
    }))


    // const {email, firstName, lastName, postalCode, city} = checkout
    return await strapi.query('cart').create({"payment_intent": stripeSession.payment_intent, ...checkout, cart_items})

  }
};
