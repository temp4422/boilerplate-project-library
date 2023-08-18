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
  app
    .route('/api/books')

    // itemController -> getItem, postItem, putItem, deleteItem
    .post(postItem)

    .get(getItem)

    .put(putItem)

    .delete(deleteItem)
}
