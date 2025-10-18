# LocalPro Marketplace

A full-stack hyperlocal services marketplace where customers can find, book, and review local professionals.

**Live Link:** [Link to your deployed app on Render]
**Demo Video:** [Link to your demo video on YouTube/Loom]

## 🌟 Project Overview

This is the capstone project for the [Your Course Name] backend course. The goal was to build a complete, real-world, product-focused application from scratch. LocalPro solves the problem of finding and booking reliable local service providers in a single, trust-driven platform.

## ✨ Core Features

- **Dual User Roles:** Separate dashboards and functionalities for Customers and Providers.
- **Full Authentication:** Secure user signup, login, and session management with password hashing (bcrypt) and Passport.js.
- **Provider Profiles:** Providers can create and manage their business profile, including a bio, location, and profile picture.
- **Service Management:** Providers can create, list, and manage the services they offer, including images and pricing.
- **Public Browsing:** Guests and customers can browse all providers and view their detailed profiles and service listings.
- **Search & Filtering:** Users can search for providers by keywords (service, business name) and location.
- **End-to-End Booking System:**
    - Customers can book a service for a specific date and time.
    - Providers see booking requests on their dashboard.
    - Providers can "Confirm" or "Cancel" pending bookings.
- **Review & Rating System:**
    - Providers can mark bookings as "Completed."
    - Customers can leave a star rating and a comment for completed bookings.
    - Average ratings and reviews are displayed on the provider's public profile.
- **Responsive UI:** Clean, mobile-first design with a hamburger menu and consistent styling.
- **Feedback:** Flash messages provide clear feedback to the user after every action (e.g., "Booking created!", "Profile updated!").

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL, Sequelize (ORM)
- **Frontend:** EJS (Templating), HTML5, CSS3, Vanilla JavaScript
- **Authentication:** Passport.js, express-session, bcrypt.js
- **File Storage:** Cloudinary (for image uploads), Multer (for file handling)
- **Deployment:** Render

## 🚀 How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [Your GitHub Repo URL]
    cd localpro-marketplace
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your database:**
    -   Create a new MySQL database named `localpro_db`.
4.  **Create your `.env` file:**
    -   Copy the `.env.example` file (you should create this) to a new file named `.env`.
    -   Fill in the required variables:
    ```
    DB_HOST=localhost
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    DB_NAME=localpro_db
    SESSION_SECRET=a_very_strong_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
5.  **Start the server:**
    ```bash
    npm run dev
    ```
6.  Open your browser and go to `http://localhost:4000` (or your specified port).
