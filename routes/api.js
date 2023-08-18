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
  getAllItems,
  postComment,
  deleteItem,
  deleteAllItems,
} = require('../controllers/itemController.js')

module.exports = function (app) {
  app.route('/api/books').post(postItem).get(getAllItems).delete(deleteAllItems)
  app.route('/api/books/:bookid').post(postComment).get(getItem).delete(deleteItem)
}
