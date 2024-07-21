const Service = require('../models/ServiceModel'); // Ensure the path to the Service model is correct

// Function to check the status of a URL
async function checkUrl(url, retries = 3) {
  // Recursive function to attempt fetching the URL
  async function attemptFetch(attemptsLeft) {
    try {
      // Dynamically import fetch function
      const { default: fetch } = await import('node-fetch');

      // Set up request options
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        },
        timeout: 10000 // 10 seconds timeout
      });

      // Check if the response is OK (status code 200-299)
      if (response.ok) {
        return 'Online'; // URL is online
      } else {
        console.error(`HTTP/HTTPS check failed for ${url}: Status Code ${response.status}`);
        // If attempts are left, retry after a delay
        if (attemptsLeft > 0) {
          console.log(`Retrying (${attemptsLeft} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retry
          return attemptFetch(attemptsLeft - 1);
        } else {
          return 'Offline'; // URL is offline after retries
        }
      }
    } catch (error) {
      console.error(`HTTP/HTTPS check failed for ${url}:`, error.message);
      // If attempts are left, retry after a delay
      if (attemptsLeft > 0) {
        console.log(`Retrying (${attemptsLeft} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retry
        return attemptFetch(attemptsLeft - 1);
      } else {
        return 'Offline'; // URL is offline after retries
      }
    }
  }

  return attemptFetch(retries); // Start the fetch attempts
}

// Exported function to handle checking the service status
exports.checkServiceStatus = async (req, res) => {
  const { url } = req.body; // Get URL from request body
  let status = 'Offline'; // Default status
  let checkedUrl = url.trim(); // Trim any leading or trailing whitespace

  // Validate URL format
  if (!checkedUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Ensure the URL starts with http or https
  if (!/^https?:\/\//i.test(checkedUrl)) {
    checkedUrl = `https://${checkedUrl}`;
  }

  // Extract hostname from the URL for logging purposes
  const hostname = new URL(checkedUrl).hostname;

  try {
    // Attempt to check the URL using https
    status = await checkUrl(checkedUrl);

    // If https fails, try http
    if (status === 'Offline' && /^https:\/\//i.test(checkedUrl)) {
      const httpUrl = checkedUrl.replace(/^https:\/\//i, 'http://');
      status = await checkUrl(httpUrl);
      checkedUrl = status === 'Online' ? httpUrl : checkedUrl; // Use http URL if it’s online
    }

    // Create a new service record with the URL and status
    const service = new Service({ url: checkedUrl, status });
   await service.save();

    // Respond with the saved service data
    res.status(201).json(service);
  } catch (err) {
    // Log the error details for debugging
    console.error('Error checking service status:', err.message, 'Hostname:', hostname);

    // Respond with the URL and 'Offline' status in case of error
    res.status(201).json({ url: checkedUrl, status: 'Offline' });
  }
};