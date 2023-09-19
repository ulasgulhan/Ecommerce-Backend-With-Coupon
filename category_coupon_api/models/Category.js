const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema ({

	name: String,
	slug: {type: String, index: true},
	parent: {
		type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "Category"
},
	ancestors:[{
	_id:{
	    type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        index: true
},
    name: String,
    slug: String
}]
});

module.exports = mongoose.model("Category", CategorySchema)
