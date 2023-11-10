import { Schema, model } from 'mongoose';

const tagSchema = new Schema({
    _id: Schema.Types.ObjectId,
  name: String,
  // Other tag-related fields if needed
});

const Tag = model('Tag', tagSchema);

export default Tag;
