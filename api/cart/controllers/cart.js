'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const YOUR_DOMAIN = 'http://localhost:3000'
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: product_data,
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });
    ctx.statusCode = 303
    ctx.send(session.url)
  }
};
