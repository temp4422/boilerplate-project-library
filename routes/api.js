/*
 *
 *
 *       Complete the API routing below
 *
 *
 */
'use strict'

const {
  postItem,
  getItem,
  postItemComment,
  deleteItem,
} = require('../controllers/itemController.js')

module.exports = function (app) {
  app.route('/api/books').post(postItem).get(getItem)
  app.route('/api/books/:bookid').get(getItem).post(postItemComment).delete(deleteItem)
}
