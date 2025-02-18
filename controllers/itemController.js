const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const { ItemModel } = require('../models/itemModel.js')

// *** POST ITEM ***
// POST /api/books Form Encoded: title=titleX
const postItem = async (req, res) => {
  let reqBody = req.body
  const { title } = reqBody
  try {
    if (!title) return res.send('missing required field title')

    const itemX = new ItemModel({
      title: title,
      comments: [],
      commentcount: 0,
    })

    await itemX.save()
    return res.json({ _id: itemX._id, title: itemX.title })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

// *** GET ITEM ***
// GET /api/books/:bookid
const getItem = async (req, res) => {
  let bookId = req.params.bookid

  try {
    if (!bookId) return res.send('no book exists')
    if (!ObjectId.isValid(bookId)) return res.send('no book exists')

    const itemX = await ItemModel.findOne({ _id: bookId })
    if (!itemX) return res.send('no book exists')
    return res.json(itemX)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

// *** DELETE ITEM ***
// DELETE /api/books/:bookid
const deleteItem = async (req, res) => {
  let bookId = req.params.bookid

  try {
    if (!bookId) return res.send('no book exists')
    if (!ObjectId.isValid(bookId)) return res.send('no book exists')

    const itemX = await ItemModel.deleteOne({ _id: bookId })
    if (!itemX.deletedCount) return res.send('no book exists')

    return res.send('delete successful')
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

// *** GET ALL ITEMS ***
// GET /api/books
const getAllItems = async (req, res) => {
  try {
    const allItemsX = await ItemModel.find()
    if (!allItemsX) return res.send('no book exists')

    // // Filter
    // const filterItems = allItemsX.map((obj) => ({
    //   _id: obj['_id'],
    //   title: obj['title'],
    //   commentcount: obj['commentcount'],
    // }))

    // return res.json(filterItems)

    return res.json(allItemsX)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

// *** POST ITEM COMMENT ***
// POST /api/books/:bookid Form Encoded: comment=XXX
const postComment = async (req, res) => {
  let bookId = req.params.bookid
  const reqBody = req.body
  const { comment } = reqBody

  try {
    if (!bookId) return res.send('no book exists')
    if (!ObjectId.isValid(bookId)) return res.send('no book exists')
    if (!comment) return res.send('missing required field comment')

    const itemX = await ItemModel.findOne({ _id: bookId })
    if (!itemX) return res.send('no book exists')

    itemX.comments.push(comment)
    itemX.commentcount++
    await itemX.save()
    return res.send(itemX)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

// *** DELETE ALL ITEMS ***
// DELETE /api/books
const deleteAllItems = async (req, res) => {
  try {
    const allItemsX = await ItemModel.deleteMany()
    if (!allItemsX) return res.send('no book exists')
    return res.send('complete delete successful')
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { postItem, getItem, getAllItems, postComment, deleteItem, deleteAllItems }
