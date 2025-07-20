# About this Project

A simple image gallery web application built with **Express.js** and **EJS**.

## 📋 Prerequisites

- Node.js & npm
- MySQL

## 📦 Installation

**1. Clone the repository**

    git clone https://github.com/tdelacarrera/Express-EJS-Image-Gallery.git
    cd express-ejs-image-gallery

**2. Install dependencies**

    npm install

**3. Set up environment variables**

    cp .env.example .env

**4. Create datasbase, run migrations and seed data**

    npx sequelize-cli db:create
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all

**5. Start the server:**

    npm run dev

You can use following login credentials.

    Email: admin@example.com

    Password: admin

✅ Ready!

Visit http://localhost:3000 to view the application in your browser.