const Website = require('../models/WebsiteModel');
const axios = require('axios');

// Add Website and Check Status
// Function to add a new website
exports.addWebsite = async (req, res) => {
  const { url, category } = req.body;

  // Validate the request body
  if (!url || !category) {
    return res.status(400).json({ message: 'URL and category are required' });
  }

  let status = 'Offline'; // Default status

  try {
    // Dynamically import fetch function
    const { default: fetch } = await import('node-fetch');

    // Attempt to check the URL
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
      },
      timeout: 5000 // 5 seconds timeout
    });

    // Update status based on response status code
    status = response.ok ? 'Online' : 'Offline';
  } catch (err) {
    // If an error occurs (e.g., DNS resolution error, network error), status remains 'Offline'
    console.error('Error checking URL:', err.message);
  }

  try {
    // Check if the website already exists
    const existingWebsite = await Website.findOne({ url });
    if (existingWebsite) {
      return res.status(400).json({ message: 'Website already exists' });
    }

    // Save the new website
    const website = new Website({ url, category, status });
    await website.save();
    res.status(201).json(website);
  } catch (err) {
    console.error('Failed to add website:', err.message);
    res.status(500).json({ message: 'Failed to add website' });
  }
};

// Get Websites
exports.getWebsites = async (req, res) => {
  try {
    const websites = await Website.find();
    res.status(200).json(websites);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch websites' });
  }
};

// Delete Website
exports.deleteWebsite = async (req, res) => {
  try {
    const website = await Website.findByIdAndDelete(req.params.id);
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }
    res.status(200).json({ message: 'Website deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete website' });
  }
};

// Update Status of All Websites
exports.updateWebsiteStatuses = async (req, res) => {
  try {
    // Dynamically import fetch function
    const { default: fetch } = await import('node-fetch');
    
    // Fetch all websites from the database
    const websites = await Website.find();

    // Iterate over each website
    for (let website of websites) {
      try {
        // Attempt to fetch the website URL
        const response = await fetch(website.url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
          },
          timeout: 10000 // 10 seconds timeout
        });

        // Update the website status based on the response status code
        website.status = response.ok ? 'Online' : 'Offline';
      } catch (error) {
        // If there's an error, mark the website as offline
        website.status = 'Offline';
      }

      // Update the last updated timestamp
      website.updatedAt = new Date();

      // Save the updated website record
      await website.save();
    }

    // Respond with success message
    res.status(200).json({ message: 'Statuses updated successfully' });
  } catch (err) {
    // Respond with failure message in case of an error
    res.status(500).json({ message: 'Failed to update statuses' });
  }
};

// Delete Website
exports.deleteWebsite = async (req, res) => {
  try {
    const website = await Website.findByIdAndDelete(req.params.id);
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }
    res.status(200).json({ message: 'Website deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete website' });
  }
};

