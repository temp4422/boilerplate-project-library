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
// PUT /api/issues/apitest Form Encoded: issue_title=titleX&issue_text=textX&created_by=userX
const putItem = async (req, res) => {
  let projectName = req.params.project
  const reqBody = req.body
  const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = reqBody

  try {
    if (!_id) return res.json({ error: 'missing _id' })

    if (!ObjectId.isValid(_id)) return res.json({ error: 'could not update', _id: _id })

    if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open)
      return res.json({ error: 'no update field(s) sent', _id: _id })

    // Find project
    const projectX = await ProjectModel.findOne({ project_name: projectName })

    // FILTER current issue with JS find() native method
    const issueX = projectX.issues.find((issue) => issue['_id'].toString() === _id)

    if (!issueX) return res.json({ error: 'could not update', _id: _id })

    // Create object to update current issue, keep same feilds if no query exists, because they will be overwritten
    const updateObj = {
      _id: issueX._id.toString(),
      issue_title: issue_title || issueX.issue_title,
      issue_text: issue_text || issueX.issue_text,
      created_by: created_by || issueX.created_by,
      assigned_to: assigned_to || issueX.assigned_to,
      status_text: status_text || issueX.status_text,
      open: open || issueX.open,
      created_on: issueX.created_on,
      updated_on: new Date(),
    }

    const findOneAndUpdate = await ProjectModel.findOneAndUpdate(
      { 'issues._id': _id },
      { $set: { 'issues.$': updateObj } },
      { new: true }
    )
    // Log updated issue using find functionality
    // console.log(findOneAndUpdate.issues.find((issue) => issue['_id'].toString() === _id))

    if (!findOneAndUpdate) return res.json({ error: 'could not update', _id: _id })

    return res.json({ result: 'successfully updated', _id: _id })
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
