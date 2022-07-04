const mongose = require('mongoose');
const slugify = require("slugify");


const categorySchema = new mongose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }

}
, { timestamps: true }

);


categorySchema.pre("validate", function(next) {
    const category = this;
    
    if(category.name) {
      category.slug = slugify(category.name, { lower: true, strict: true });
    }
  
    next();
})
  

module.exports = mongose.model('Category', categorySchema);

