const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    video: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
  
    },
    {timestamps: true}
);

module.exports = mongoose.model('Post', PostSchema);