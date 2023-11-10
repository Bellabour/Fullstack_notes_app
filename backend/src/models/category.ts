import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
    _id: Schema.Types.ObjectId,
  name: String,
  // Other category-related fields if needed
});

const Category = model('Category', categorySchema);

export default Category;
