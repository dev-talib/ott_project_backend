const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

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


router.get('/video/:id', async (req, res) => {
    const videoId = req.params.id;
    const data = await Post.findById(videoId);
    const videoUrl = data.video;
    
    try {
        // Define a smaller range for the video to stream.
        // For example, this will only request the first 512KB of the video:
        const RANGE_SIZE = 200 * 1024; // 200KB
        const rangeHeader = req.headers.range;
        let start = 0;
        let end = RANGE_SIZE;

        if (rangeHeader) {
            const parts = rangeHeader.replace(/bytes=/, "").split("-");
            start = parseInt(parts[0], 10);
            end = parts[1] ? parseInt(parts[1], 10) : start + RANGE_SIZE;
        }

        const response = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream',
            headers: {
                Range: `bytes=${start}-${end}`
            }
        });

        res.writeHead(response.status, {
            ...response.headers
        });

        // Stream the video from the remote URL to the client
        response.data.pipe(res);
    } catch (error) {
        console.error("Error streaming the video: ", error);
        res.sendStatus(500);
    }
});



module.exports = router;
