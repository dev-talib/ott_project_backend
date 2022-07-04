const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');

router.get('/all', (req, res) => {
    Category.find().sort({_id:-1}) 
        .then(categories => {
            res.json(categories);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error getting categories' });
        });
}
);

router.post('/new', (req, res) => {
    console.log(req.body)
    const newCategory = new Category({
        name: req.body.name,
    })
    newCategory.save()
        .then(category => {
            res.status(201).json({ message: 'Category created successfully' });
        } )
        .catch(err => {
            res.status(500).json({ message: 'Error creating category', err });
        } );
});

router.get('/:slug', (req, res) => {
    Category.findOne({ name: req.params.slug })
        .then(category => {
            res.json(category);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error getting category' });
        });
});

router.delete('/delete_all',(req,res)=>{
    Category.deleteMany().then(()=>{
        res.json("all category deleted successfully")
    }).catch((err)=>{
        res.json(err)
    })
})



module.exports = router;