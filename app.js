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
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload size limit
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Set higher timeout for the server
app.use((req, res, next) => {
  // Set a longer timeout for specific routes
  if (req.path.includes('/api/generate-content')) {
    req.setTimeout(60000000); // 5 minutes for content generation
  }
  next();
});

app.get('/',(req,res) =>{
  res.json({hello:"hello"})
})

// Routes
app.use('/api', generateContentRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});
              
// Start server
const PORT = 3000;
const http = require('http');
const server = http.createServer(app);

// Set server timeout to a higher value
server.timeout = 60000000; // 10 minutes
server.keepAliveTimeout = 60000000; // 2 minutes
server.headersTimeout = 60000000; // 2 minutes

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
