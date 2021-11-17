'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const stripe = require('stripe')('sk_test_51J0yVyKxbju7nISONWbOx0ntsoHd6Nf7YjZ6wkxqB91ty5i4RlVWeLHyUXZ0JpSDx6B1nwQ25rFXEoxd3CMjbTOU00LneYuN4Z');

// const YOUR_DOMAIN = 'http://localhost:3000'
const YOUR_DOMAIN = 'https://les-savons-de-celine-web.herokuapp.com/'

const getDiscountAmount = (products, promoCode) => {
  if (!promoCode) return 0
  let discount = 0
  const cartPrice = products.reduce((a, b) => a + (b['price'] * b['count'] || 0), 0)
  if (promoCode.type === 'percentage') {
    discount = (promoCode.amount / 100) * cartPrice
  } else if (promoCode.type === 'price') {
    discount = promoCode.amount
  }
  return !promoCode.minimum_price || promoCode.minimum_price <= cartPrice ? discount : 0
}

const getTotalPrice = (products, promoCode) => {
  const cartPrice = products.reduce((a, b) => a + (b['price'] * b['count'] || 0), 0)
  let finalPrice = cartPrice - getDiscountAmount(products, promoCode)
  if (cartPrice < 60) finalPrice += 10
  return (finalPrice * 1.14975).toFixed(2)
}

const getMetadata = (request) => {
  const {checkout, products} = request
  const p = products.map((product) => (JSON.stringify({id: product.id, count: product.count})))
  return [...p, JSON.stringify(checkout)]

}


module.exports = {
  checkout: async (ctx) => {
    console.log(ctx.request.body)
    const {products, checkout} = ctx.request.body;

    let product_data = []
    products.map((product) => {
      let images = []
      product.pictures.map((image) => {
        images.push(image.url)
      })
      product_data.push({
        price_data: {
          product_data: {
            name: product.title, images
          },
          currency: 'cad',
          unit_amount: product.price * 100,
        },
        quantity: product.count
      })
    })
    // if(validPromoCode) {
    //   product_data.push({
    //     price_data: {
    //       product_data: {
    //         name: `Code promotionnel - ${validPromoCode.name}`
    //       },
    //       currency: 'cad',
    //       unit_amount: -getDiscountAmount(products, validPromoCode)*100
    //     },
    //     quantity: 1
    //   })
    // }

    // let line_items = {
    //   price_data: {
    //     currency: 'cad',
    //     product_data: {
    //       name: 'Stubborn Attachments',
    //       images: ['https://i.imgur.com/EHyR2nP.png'],
    //     },
    //     unit_amount: 2000,
    //   },
    //   quantity: 1,
    // }
    let options = {
      payment_method_types: ['card'],
      line_items: product_data,
      metadata: getMetadata(ctx.request.body),
      // automatic_tax: {
      //   enabled: true,
      // },
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    }

    // TODO - create a cart with all the infos needed

    if (products.reduce((a, b) => a + (b['price'] * b['count'] || 0), 0) < 60) {
      options['shipping_rates'] = ['shr_1JuGJcKxbju7nISOJNwI8omj']
    }

    const session = await stripe.checkout.sessions.create(options);
    await strapi.services.cart.create(session, products, checkout)
    ctx.statusCode = 303

    console.log(session)
    ctx.send(session.url)
  },
  async stripeCheckout(ctx) {
    // console.log(ctx.request.body)
    if(ctx.request.body.type === 'payment_intent.succeeded') {
    //   console.log('here i am')
      const {id, amount, status} = ctx.request.body.data.object;
      // const cart = await strapi.findOne('cart').where({payment_intent: id})
      const cart = await strapi.services.cart.findOne({payment_intent: id})

      const order = await strapi.query('order').create({cart: cart.id, status: 'paid', total: amount/100})
    }
    ctx.send({success: true})
  }
};
// TODO - webhook apres la creation du lien
// sauver le payment_intent ID et lier ses metadatas
// suite au payment_intent.succeed -> retrouver les metadatas et creer le l'order avec les metadatas
