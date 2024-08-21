// server.js

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 80;

// Middleware to parse JSON request bodies
app.use(express.json());
// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));
// Handle any other requests (useful for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
// Define the path to the config.json file
const configFilePath = path.join(__dirname, 'build', 'config.json');

// GET endpoint to fetch the current config
app.get('/api/config', async (req, res) => {
  try {
    const data = await fs.readFile(configFilePath, 'utf8');
    const config = JSON.parse(data);
    res.json(config);
  } catch (err) {
    console.error('Error reading the config file:', err);
    res.status(500).json({ error: 'Unable to read the config file' });
  }
});

// POST endpoint to update the backendUrl
app.post('/api/config', async (req, res) => {
    console.log(req.body.backendUrl)
  const { backendUrl } = req.body;

  // Validate the input
//   if (typeof backendUrl !== 'string' || !/^https?:\/\/[^\s]+$/.test(backendUrl)) {
//     return res.status(400).json({ error: 'Invalid backendUrl' });
//   }

  try {
    // Read the existing config
    const data = await fs.readFile(configFilePath, 'utf8');
    const config = JSON.parse(data);
    // Update the backendUrl
    config.backendUrl = backendUrl+":"+81;

    // Write the updated config back to the file
    await fs.writeFile(configFilePath, JSON.stringify(config, null, 2), 'utf8');
    
    res.status(200).json({ message: 'Config updated successfully' });
  } catch (err) {
    console.error('Error updating the config file:', err);
    res.status(500).json({ error: 'Unable to update the config file' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
