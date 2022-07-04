const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const port = process.env.PORT || 4000;
const dotenv = require('dotenv');

dotenv.config();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/category', categoryRoutes);

// database
const CONNECTION_URL = process.env.DB_URL;
mongoose.connect(CONNECTION_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
}).then(()=>{
    console.log('database is connected successfully')
}).catch((e)=>{
    console.log(e)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
