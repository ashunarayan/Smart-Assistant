const express = require('express');
const app = express();
const session=require('express-session');
const passport=require('./passport/passport.js');
const dotenv = require('dotenv');
dotenv.config();
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
const aiRoutes = require('./routes/aiRoutes');
app.use('/ai', aiRoutes);
app.get("/dashboard",(req,res)=>{
  if(!req.user) return res.redirect("/auth/google");
  res.send(`Welcome ${req.user.name}`);
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
