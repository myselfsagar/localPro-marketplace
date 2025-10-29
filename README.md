# LocalPro Marketplace

A full-stack hyperlocal services marketplace where customers can find, book, and review local professionals.

**Live Link:** https://bold.pro/my/sagar-sahu-251021193117
**Demo Video:** [Link to your demo video on YouTube/Loom]

## 🌟 Project Overview

The goal of this project is to build a complete, real-world, product-focused application from scratch. LocalPro solves the problem of finding and booking reliable local service providers in a single, trust-driven platform. Built with a focus on user experience and real-world application, mimicking features found in popular service marketplaces.

## ✨ Core Features

- **Dual User Roles:** Separate dashboards and functionalities for Customers and Providers.
- **Full Authentication:** Secure user signup, login, and session management with password hashing (bcrypt) and Passport.js.
- **Password Reset:** Secure flow for users to reset forgotten passwords via email link using Brevo (formerly Sendinblue).
- **Provider Profiles:** Providers can create and manage their business profile, including a bio, location, and profile picture.
- **Service Management (CRUD):** Providers can create, list, update, and delete the services they offer, including images and pricing.
- **Public Browsing:** Guests and customers can browse all providers and view their detailed profiles and service listings.
- **Search & Filtering:** Users can search for providers by keywords (service, business name) and location.
- **End-to-End Booking System:**
  - Customers can book a service for a specific date and time.
  - Providers see booking requests on their dashboard.
  - Providers can "Confirm" or "Cancel" pending bookings.
- **Review & Rating System:**
  - Providers can mark bookings as "Completed."
  - Customers can leave a star rating and a comment for completed bookings.
  - Average ratings and reviews are dynamically calculated and displayed on the provider's public profile.
- **Responsive UI:** Clean, mobile-first design with a hamburger menu and consistent styling across forms and buttons.
- **Feedback:** Flash messages provide clear feedback to the user after every action (e.g., "Booking created!", "Profile updated!").
- **Cloud Image Uploads:** Integrated image uploads for provider profiles and services using Multer and Cloudinary.

## 🛠️ Tech Stack

- **Backend:** Node.js (v20.x), Express.js
- **Database:** MySQL, Sequelize (ORM)
- **Frontend:** EJS (Templating), HTML5, CSS3, Vanilla JavaScript
- **Authentication:** Passport.js, express-session, bcrypt.js
- **File Storage:** Cloudinary, Multer, multer-storage-cloudinary
- **Email:** Brevo (formerly Sendinblue) via `sib-api-v3-sdk`
- **Deployment:** Render (Web Service), Aiven (MySQL Database)

## 📸 Screenshots

![Provider Browse Page](path/to/screenshot-browse.png)
_Browse page with search functionality_

![Provider Detail Page](path/to/screenshot-detail.png)
_Provider profile showing details, services, and reviews_

![Customer Dashboard](path/to/screenshot-dashboard.png)
_Customer dashboard displaying booking history_

## 🚀 How to Run Locally

1.  **Prerequisites:**

    - Ensure you have **Node.js** (v20.x or later recommended) installed.
    - Ensure you have **MySQL** installed and running.

2.  **Clone the repository:**

    ```bash
    git clone https://github.com/myselfsagar/localPro-marketplace.git
    cd localpro-marketplace
    ```

3.  **Install dependencies:**

    ```bash
    # You might need the --legacy-peer-deps flag due to dependency conflicts
    npm install --legacy-peer-deps
    ```

4.  **Set up your database:**

    - Create a new MySQL database named `localpro_db`.

5.  **Create your `.env` file:**

    - Create a `.env` file in the root directory by copying the `.env.example` file.
    - Fill in your actual database credentials, Cloudinary keys, Brevo key, and session secret in the `.env` file:

      ```ini
      PORT=4000 # Or your desired local port

      # Database Credentials
      DB_HOST=localhost
      DB_USER=your_mysql_username
      DB_PASSWORD=your_mysql_password
      DB_NAME=localpro_db
      DB_PORT=3306

      # Session Secret
      SESSION_SECRET=a_very_strong_random_secret_key

      # Cloudinary Credentials
      CLOUDINARY_CLOUD_NAME=your_cloud_name
      CLOUDINARY_API_KEY=your_api_key
      CLOUDINARY_API_SECRET=your_api_secret

      # Brevo (Sendinblue) API Key
      BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

      # Base URL (for email links)
      BASE_URL=http://localhost:4000
      ```

6.  **Start the server:**

    ```bash
    npm run dev
    ```

7.  Open your browser and navigate to `http://localhost:4000` (or the port you specified in `.env`).

## 📞 Contact

Sagar Sahu - https://www.linkedin.com/in/myselfsagar/ - myselfsagar@zohomail.in

Project Link: https://github.com/myselfsagar/localPro-marketplace.git
