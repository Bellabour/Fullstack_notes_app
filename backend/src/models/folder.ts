import { Schema, model } from 'mongoose';

const folderSchema = new Schema({
    _id: Schema.Types.ObjectId,  
  name: String,
  // Other folder-related fields if needed
});

const Folder = model('Folder', folderSchema);

export default Folder;
