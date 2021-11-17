'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const moment = require('moment')
module.exports = {
  async verifyCode(ctx){
    const { code } = ctx.request.body;
    const codes = await strapi.services['promo-code'].find()
    const now = moment()
    const validCodes = codes.filter((_code) => (
      _code.name === code && moment(_code.startDate).isBefore(now) && moment(_code.endDate).isAfter(now)
    ))
    if (validCodes.length === 1) {
      const _code = validCodes[0]
      ctx.send({
        name: _code.name,
        amount: _code.amount,
        type: _code.type,
        minimum_price: _code.minimum_price
      }, 201);
    } else {
      ctx.send({ message: 'Invalid code'}, 400)
    }
  }
};
