/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
'use strict'

const { postItem, getItem, putItem, deleteItem } = require('../controllers/itemController.js')

module.exports = function (app) {
  app.route('/api/books').post(postItem)
  app.route('/api/books/:bookid').get(getItem).put(putItem).delete(deleteItem)
}
