const express = require('express');
const bodyParser = require('body-parser');
const generateContentRouter = require('./generateContent');
const cors=require('cors')
const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true, 
};

app.use(cors());
// Middleware
app.use(bodyParser.json());
app.get('/',(req,res) =>{

  res.json({hello:"hello"})
}
)

// Routes
app.use('/api', generateContentRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
              
// Start server
const PORT =  3000;
app.listen(PORT, () => {
  console.log("test");
  
  console.log(`Server running on port ${PORT}`);
});
