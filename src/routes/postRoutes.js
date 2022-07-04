const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Category = require('../models/Category');

router.post('/new', (req, res) => {
    console.log(req.body)
    const newPost = new Post({
        title: req.body.title,
        description: req.body.description,
        video: req.body.video,
        user: req.body.user,
        category: req.body.category
        });
        newPost.save()
            .then(post => {
                res.status(201).json({ message: 'Post created successfully' });
            })  
            .catch(err => {
                res.status(500).json({ message: 'Error creating post' });
            });
});

router.get('/search',async(req,res)=>{
    console.log(req.query.search)
    const keyword = req.query.search
      ? {
          $or: [
              {title: { $regex: req.query.search, $options: "i"}},
              {description: {$regex: req.query.search, $options: "i"}},
          ],
      }
      :{};

    Post.find(keyword).sort({_id:-1}) 
    .populate('user')
    .populate('category')
    .then(posts => {
        console.log(posts)
        res.json(posts);
    })
    .catch(err => {
        res.status(500).json({ message: 'Error getting posts' });
    });
  
});

router.get('/all', (req, res) => {
    Post.find().sort({_id:-1}) 
        .populate('user')
        .populate('category')
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error getting posts' });
        });
});

router.get('/featured', (req, res) => {  
    Post.find().sort({_id:-1})
        .then(posts => {
            const randomPost = posts[Math.floor(Math.random() * posts.length)];
            res.json(randomPost);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error getting post' });
    });


});

router.get('/recent',(req,res)=>{
    Post.find().sort({_id:-1}).limit(8)
        .then(posts => {
            res.json(posts);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error getting posts' });
        });
})

router.get('/:id', (req, res) => {
    console.log(req.params.id)
    Post.findById(req.params.id)
        .populate('user')
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error getting post' });
        });
});

router.get('/user/:id', (req, res) => {
    Post.find({ user: req.params.id })
        .populate('user')
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error getting posts' });
        });
});

router.put('/:id', (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error updating post' });
        });
});

router.delete('delete/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error deleting post' });
        });
}
);

router.delete('/delete_all/', (req, res) => {
    console.log('hit')
    Post.deleteMany( function(err){
        if(!err){
            res.send("Successfully deleted all Articles");
        }else{
            res.send(err);
        }
    });
});


router.get('/category/:slug', async (req, res) => {
    console.log(req.params.slug)
    const category = await Category.findOne({ slug: req.params.slug });
    console.log(category._id)

    Post.find({ category: category._id })
    .populate('user')
    .populate('category')
    .then((post)=>{
        res.json({post, category})
    }
    ).catch(err => {
        res.status(500).json({ message: 'Error getting posts' });
    })
    
});

module.exports = router;
