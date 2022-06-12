// const mongoose = require("mongoose");

// const ListSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true, unique: true },
//     type: { type: String },
//     genre: { type: String },
//     content:{type:Array}
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("List", ListSchema);

import mongoose, { Schema, model, Document, Model } from 'mongoose'
const AutoIncrement = require('mongoose-sequence')(mongoose)

export interface ListPayload {
  title: string
  type: string
  genre: string
  content: string
}

interface IListDocument extends ListPayload, Document {
  id: number
}

interface IList extends IListDocument {}
interface IListModel extends Model<IList> {}

const ListSchema = new Schema<IListDocument>(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    type: { type: String },
    genre: { type: String },
    content: { type: String }
  },
  { timestamps: true }
)
ListSchema.plugin(AutoIncrement, { inc_field: 'id' })

export const List: IListModel = model<IList, IListModel>('List', ListSchema)

export default List
