const mongoose = require('mongoose')

// Create item schema
const itemSchema = new mongoose.Schema({
  // _id // Mongoose add id property by default https://mongoosejs.com/docs/guide.html#_id
  title: { type: String, required: true },
  comments: { type: Array },
  commentcount: { type: Number, default: 0 },
  // assigned_to: { type: String, default: '', required: false },
  // status_text: { type: String, default: '', required: false },
  // open: { type: Boolean, default: true },
  // created_on: { type: Date, default: Date.now, required: true },
  // updated_on: { type: Date, default: Date.now, required: true },
})
// Create model wrapper on schema
const ItemModel = mongoose.model('ItemModel', itemSchema)

// // Create project schema
// const projectSchema = new mongoose.Schema({
//   project_name: { type: String, required: true, unique: true, dropDups: true },
//   issues: [itemSchema],
// })
// // Create model wrapper on schema
// const ProjectModel = mongoose.model('ProjectModel', projectSchema)

// Export models
module.exports = {
  ItemModel,
  // ProjectModel
}
