const helper = require('../helper/helper')
module.exports = {
  testApi: async (request, response) => {
    try {
      return helper.response(response, 200, 'Welcome to api coffeeshop v2')
    } catch (error) {
      console.log(error)
      return helper.response(response, 400, 'bad request', error)
    }
  }
}