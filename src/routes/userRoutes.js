const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/',async(req,res)=>{
    const keyword = req.query.search
      ? {
          $or: [
              {name: { $regex: req.query.search, $options: "i"}},
              {email: {$regex: req.query.search, $options: "i"}},
          ],
      }
      :{};

    const users = await User.find(keyword)
    res.send(users); 
});

// random index users
router.get('/random',async(req,res)=>{
    const users = await User.aggregate([
        { $sample: { size: 3 } },
    ]).limit(2);
    res.send(users); 
}
);


router.get('/:id',(req,res)=>{
    User.findById(req.params.id)
    .then((user)=>{
        const {username,email,picture} = user
        res.json({username,email,picture})
    })
    .catch(err=>res.send(err))
});

router.get('/:id/posts',(req,res)=>{
    User.findById(req.params.id)
    .populate('posts')
    .then((user)=>{
        res.json(user.posts)
    })
    .catch(err=>res.send(err))
}
)

router.delete('/',(req,res)=>{
    User.deleteMany()
    .then(()=>res.send('All users deleted'))
    .catch(err=>res.send(err))
}
);

module.exports = router;