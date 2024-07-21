# LinkScanner

Welcome to LinkScanner, your ultimate tool for real-time monitoring and management of website statuses.

---

## Overview
LinkScanner is designed to provide seamless and efficient monitoring of website statuses. With real-time updates, secure authentication, and user-friendly interfaces, it offers a comprehensive solution for keeping track of your favorite websites' availability and performance.

---

## Features
### Secure Authentication
LinkScanner uses token-based authentication to ensure secure access for administrators. Login sessions are maintained using JSON Web Tokens (JWT) stored in local storage.

### Admin Portal
- **Add and Delete Websites:** Administrators can easily add new websites by providing the URL and selecting a category. Websites can also be deleted from the list as needed.
- **Admin Dashboard:** A dedicated dashboard for administrators to manage websites and view real-time status updates.

### User Portal
- **Check Website Status:** Users can manually check the status of any website by entering its URL. The platform validates the URL and provides instant feedback on its status.
- **Real-Time Status Monitoring:** The platform fetches and updates the status of all monitored websites every 3 seconds, ensuring users always have the latest information.

### User-Friendly Interface
LinkScanner features an intuitive interface with a dedicated admin dashboard, real-time status cards, and a detailed status table.

---

## Technologies
### Frontend
- React.js
- HTML
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

---

## Getting Started
### Prerequisites
Before getting started with LinkScanner, ensure you have:
- Node.js installed on your system.
- MongoDB Atlas account.

### Backend Setup
1. Navigate to the `backend` directory.
    ```
    cd backend
    ```
2. Install backend dependencies with:
    ```
    npm install
    ```
3. Start the backend server using:
    ```
    npm start
    ```

### Frontend Setup
1. Navigate to the `frontend` directory.
    ```
    cd frontend
    ```
2. Install frontend dependencies with:
    ```
    npm install
    ```
3. Start the frontend server using:
    ```
    npm run dev
    ```

---

## Purpose
LinkScanner is meticulously crafted to serve as a reliable tool for monitoring the availability and performance of websites. It is designed to help everyone ensure their services are running smoothly and to provide users with real-time status updates.

Happy monitoring and managing! 
