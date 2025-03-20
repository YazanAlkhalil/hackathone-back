const express = require('express');
const bodyParser = require('body-parser');
const generateContentRouter = require('./generateContent');
const cors = require('cors');
const app = express();
const corsOptions = {
  origin: '*', // Allow all origins in production or use environment variable
  credentials: true, 
};

// Use the corsOptions configuration
app.use(cors(corsOptions));

// Middleware
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload size limit
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Set higher timeout for the server
app.use((req, res, next) => {
  // Set a longer timeout for specific routes
  if (req.path.includes('/api/generate-content')) {
    req.setTimeout(300000); // 5 minutes (300,000 ms) for content generation
    res.setTimeout(300000); // Also set response timeout
  }
  next();
});

// Add keep-alive headers for long-running requests
app.use((req, res, next) => {
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Keep-Alive', 'timeout=300'); // 5 minutes in seconds
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
const PORT = process.env.PORT || 3000;
const http = require('http');
const server = http.createServer(app);

// Set server timeout to a more reasonable value
server.timeout = 300000; // 5 minutes
server.keepAliveTimeout = 120000; // 2 minutes
server.headersTimeout = 120000; // 2 minutes

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
