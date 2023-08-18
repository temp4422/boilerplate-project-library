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
      // _id automatically added
      title: title,
      comments: [],
      commentcount: 0,
    })

    // Find project with ASYNC opearation, must use 'await'!
    // let projectX = await ProjectModel.findOne({ project_name: projectName })

    // If project doesn't exists, create one
    // if (!projectX) projectX = await ProjectModel.create({ project_name: projectName })

    // If project exists push issue into this project
    // projectX.issues.push(issueX)

    // Save to database
    await itemX.save()
    return res.json({ _id: itemX._id, title: itemX.title })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Server error' })
  }
}

// *** GET ITEM ***
// GET /api/books/:bookid
const getItem = async (req, res) => {
  let bookId = req.params.bookid

  try {
    const itemX = await ItemModel.findOne({ _id: bookId })
    if (!itemX) return res.send('no book exists')
    return res.json(itemX)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Server error' })
  }
}

// *** PUT ITEM ***
// PUT /api/books/:bookid Form Encoded: _id=bookID&comment=testcommentXXX
const putItem = async (req, res) => {
  let bookId = req.params.bookid
  const reqBody = req.body
  const { comment } = reqBody

  try {
    if (!bookId) return res.send('no book exists')
    if (!ObjectId.isValid(bookId)) return res.send('no book exists')
    if (!comment) return res.send('missing required field comment')

    // Find item and update
    const itemX = await ItemModel.findOne({ _id: bookId })
    itemX.comments.push(comment)
    itemX.commentcount++
    await itemX.save()

    return res.send(itemX)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Server error' })
  }
}

// *** DELETE ITEM ***
// DELETE /api/issues/apitest Form Encoded: _id=64ddeeeb5977467f332b2f7a
const deleteItem = async (req, res) => {
  let projectName = req.params.project
  const { _id } = req.body

  try {
    if (!req.body._id) return res.json({ error: 'missing _id' })
    if (!ObjectId.isValid(_id)) return res.json({ error: 'could not delete', _id: _id })

    // Delete (update with $pull) https://dev.to/paulasantamaria/mongodb-animated-adding-and-removing-elements-from-arrays-50cl
    const confirmDelete = await ProjectModel.updateOne(
      { 'issues._id': _id },
      { $pull: { issues: { _id: _id } } }
    )
    // console.log(confirmDelete.matchedCount)
    if (!confirmDelete.matchedCount) return res.json({ error: 'could not delete', _id: _id })

    return res.json({ result: 'successfully deleted', _id: _id })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { postItem, getItem, putItem, deleteItem }
