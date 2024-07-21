import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formatDate = (dateString) => {
  const options = { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
    hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' 
  };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

function ServiceStatus() {
  const [checkUrl, setCheckUrl] = useState('');
  const [checkStatus, setCheckStatus] = useState('');
  const [addUrl, setAddUrl] = useState('');
  const [category, setCategory] = useState('');

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [websites, setWebsites] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingCheckStatus, setLoadingCheckStatus] = useState(false);
  const [loadingAddWebsite, setLoadingAddWebsite] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchData = async () => {
    setLoadingTable(true);
    try {
      await axios.put('http://localhost:5000/api/website/web/update-statuses'); // Update statuses
      const response = await axios.get('http://localhost:5000/api/website/web');
      setWebsites(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    //  alert('Failed to fetch data. Please check your server.');
    }
    setLoadingTable(false);
  };

  useEffect(() => {
    fetchData(); // Fetch data on component mount
    const interval = setInterval(fetchData, 3000); // Fetch data every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const checkServiceStatus = async () => {
    let serviceUrl = checkUrl.trim();
    if (!serviceUrl) {
      setCheckStatus('');
      alert("Please Enter URL");
      return;
    }
  
    if (!serviceUrl.startsWith('http://') && !serviceUrl.startsWith('https://')) {
      serviceUrl = 'https://' + serviceUrl;
    }
  
    setLoadingCheckStatus(true); // Set loading before the request
  
    try {
      const response = await axios.post('http://localhost:5000/api/services/check', { url: serviceUrl });
      setCheckStatus(response.data.status);
    } catch (error) {
      setCheckStatus('Offline');
      console.error('Error checking service status:', error);
    }
  
    setLoadingCheckStatus(false); // Set loading false after the request
  };
  

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        userName: username,
        password: password
      });
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      setShowLoginModal(false);
    } catch (error) {
      alert("Login failed. Please check your username and password");
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const addWebsite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      return;
    }
  
    let serviceUrl = addUrl.trim().replace(/\s+/g, '');
    if (!serviceUrl || !category) {
      alert('URL and category are required.');
      return;
    }
  
    if (!serviceUrl.startsWith('http://') && !serviceUrl.startsWith('https://')) {
      serviceUrl = 'http://' + serviceUrl;
    }
  
    try {
      setLoadingAddWebsite(true);
      const response = await axios.post(
        'http://localhost:5000/api/website/web',
        { url: serviceUrl, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 201) {
        setWebsites(prevWebsites => [...prevWebsites, response.data]);
        setAddUrl('');
        setCategory('');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('This website already exists.');
      } else {
        console.error('Failed to add website:', error);
        alert('Failed to add website. Please try again later.');
      }
    } 
    setLoadingAddWebsite(false);
  };

  const deleteWebsite = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/website/web/${id}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWebsites(prevWebsites => prevWebsites.filter(website => website._id !== id));
    } catch (error) {
      alert('Failed to delete website.');
      console.error('Failed to delete website:', error);
    }
  };

  const extractDomain = (url) => {
    const domain = (new URL(url)).hostname.replace('www.', '');
    return domain.split('.')[0].toUpperCase();
  };

 
  return (
    <div className='container mx-auto p-2 rounded text-center'>
      <img src="/logo.png" alt="Logo" className='mx-auto mb-4' style={{ maxWidth: '170px' }} />
      <p className='text-gray-700 text-2xl font-light'>Stay informed about the status of your favorite services.</p>

      {!isLoggedIn ? (
        <button
          className='bg-gray-600 text-sm p-2 text-white rounded-md'
          onClick={() => setShowLoginModal(true)}
          style={{ float: "right" }}
        >
          Login Admin
        </button>
      ) : (
        <button
          className='bg-gray-600 text-sm p-2 text-white rounded-md'
          onClick={handleLogout}
          style={{ float: "right" }}
        >
          Logout
        </button>
      )}
      <br />
      {showLoginModal && (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Admin Login</h2>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="border p-2 w-full mb-2 rounded"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border p-2 w-full mb-4 rounded"
              />
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white p-2 w-full mb-4 rounded"
              >
                Login
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="bg-gray-500 text-white p-2 w-full rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

      {isLoggedIn && (
        <>
          <h2 className="text-3xl font-normal text-center text-white bg-cyan-500 p-2 mt-5 rounded-full">Admin Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-5 bg-white shadow-md rounded-md">
              <h2 className='text-2xl mb-3 '> Add Website </h2>
              <input
                type="text"
                value={addUrl}
                onChange={(e) => setAddUrl(e.target.value)}
                placeholder="Enter Website URL"
                className="border p-2 w-full mb-2 rounded"
              />
             
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
              >
              <option value="">Select Category</option>
                <option value="Search Engine">Search Engine</option>
                <option value="Social Media">Social Media</option>
                <option value="Other">Other</option>
              </select>
             
              <br />
              <button
                onClick={addWebsite}
                className="bg-green-500 text-white p-2 w-full rounded-full"
              >
                {loadingAddWebsite ? (
                  <div className="flex justify-center items-center">
                    <span> Adding </span> 
                    <div className="m-2 loader ease-linear rounded-full border-4 border-blue-500 border-t-blue-300 h-8 w-8 animate-spin"></div>
                  </div>
                ) : (
                  'Add Website'
                )}
              </button>
            </div>
            <div className="p-5 bg-white shadow-md rounded-md relative overflow-x-auto">
              <h2 className='text-2xl mb-3 '> View Websites </h2>
              {loadingTable && !lastUpdated ? (
                <div className="flex justify-center items-center">
                  <span> Loading </span> 
                  <div className="m-2 loader ease-linear rounded-full border-4 border-blue-500 border-t-blue-300 h-8 w-8 animate-spin"></div>
                </div>
              ) : (
                <table className="min-w-full bg-white border-collapse border border-gray-200">
                  <thead>
                    <tr>
                      <th className="border border-gray-200 px-4 py-2">SN</th>
                      <th className="border border-gray-200 px-4 py-2">Website</th>
                      <th className="border border-gray-200 px-4 py-2">Category</th>
                      <th className="border border-gray-200 px-4 py-2">Status</th>
                      <th className="border border-gray-200 px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {websites.map((website, index) => (
                      <tr key={website._id}>
                        <td className="border border-gray-200 px-4 py-2">{index + 1}</td>
                        <td className="border border-gray-200 px-4 py-2">{website.url}</td>
                        <td className="border border-gray-200 px-4 py-2">{website.category}</td>
                        <td className="border border-gray-200 px-4 py-2">{website.status}</td>
                         <td className="border border-gray-200 px-4 py-2">
                          <button
                            onClick={() => deleteWebsite(website._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-center mt-3">
        <div className="max-w-md w-full p-2 bg-white shadow-md rounded text-center">
          <h2 className="text-lg font-semibold mb-2">Check Website Status</h2>
          <input
            type="text"
            value={checkUrl}
            onChange={(e) => {
              setCheckUrl(e.target.value);
              if (e.target.value.trim() === '') {
                setCheckStatus('');
              }
            }}
            placeholder="Enter Website URL"
            className="border p-2 w-full mb-4 rounded"
          />
          <button
            onClick={checkServiceStatus}
            className="bg-blue-500 text-white p-2 w-full mb-3 rounded-full"
          >
            Check Status
          </button>
          {loadingCheckStatus ? (
            <div className="flex justify-center items-center">
              <span> Loading </span> 
              <div className="m-2 loader ease-linear rounded-full border-4 border-blue-500 border-t-blue-300 h-8 w-8 animate-spin"></div>
            </div>
          ) : (
            checkStatus !== '' && (
              <p className="text-sm text-gray-700 mb-2">
                Status: {' '}
                <span className={`rounded px-2 py-1 ${checkStatus === 'Online' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {checkStatus}
                </span>
              </p>
            )
          )}
        </div>
      </div>

      <div className='flex items-center justify-center flex-col rounded mt-2 mb-2'>
        <h2 className='text-3xl font-light p-2 rounded-full text-black'>
          Real-Time Status Of Websites
        </h2>

        
      
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
        {websites.map(website => (
          <div key={website._id} className="p-4 bg-white shadow-md rounded-md text-center">
            <h2 className="text-4xl font-light mb-3">
              {extractDomain(website.url)}
            </h2>
            <p className="text-sm text-gray-700 mb-3">
              <span className={`rounded px-2 py-1  ${website.status === 'Online' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {website.status}
              </span>
            </p>
            <p>{formatDate(website.updatedAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceStatus;
