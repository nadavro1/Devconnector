const express = require('express');

const app = express();
const connectDB= require('./config/db') 

connectDB();

//Init middleware
app.use(express.json({extended:false}));

app.get('/',(req,res)=>{
    res.send("API running")
})

app.use('/api/users',require('./Routes/API/users'));
app.use('/api/posts',require('./Routes/API/posts'));
app.use('/api/profile',require('./Routes/API/profile'));
app.use('/api/auth',require('./Routes/API/auth'));

const PORT= process.env.PORT || 5000;

app.listen(PORT,() => {console.log(`Listening on port ${PORT}`)});