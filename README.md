# Google OAuth2 Authentication System (Node.js + MongoDB + MVC)

A production-ready, viewless REST API built with Node.js, Express, and MongoDB that implements secure Google OAuth2 login authentication using Passport.js and JSON Web Tokens (JWT). This repository strictly follows the **MVC (Model-View-Controller)** software design pattern and is optimized for headless backend setups tested via Postman.

---

## 🏗️ MVC Architecture & Project Layout

This application completely separates data structures, business logic, and API endpoints using the **Model-View-Controller (MVC)** framework. Since this is a pure backend service, **Views are absent**, and responses are served entirely as structured JSON payloads.

```text
├── config/
│   └── db.js            # MongoDB database connection instance
│   └── passport.js      # New file for Passport strategy configuration
├── controllers/
│   └── auth.controller.js # Pure business logic (Handles token generation)
├── models/
│   └── user.model.js     # Database schemas and Mongoose abstraction mapping
├── routes/
│   └── auth.routes.js    # Express route endpoints parsing incoming paths
├── .env                  # Segregated, ignored application environment variables
└── server.js             # Main server setup and core execution entry point
```

### Deep-Dive Structural Breakdown
* **Models (`/models`)**: Defines the data rules and shapes. This component talks directly to MongoDB via Mongoose. It ensures that incoming Google profile properties are safely mapped to application fields.
* **Controllers (`/controllers`)**: The brain of the application. It takes user identity data forwarded by the routing engine, creates standard secure JSON Web Tokens (JWTs), and constructs uniform JSON string structures returned to the client.
* **Routes (`/routes`)**: The traffic director. It associates incoming HTTP request patterns (like `GET /api/auth/google`) with corresponding middleware chains and controller handlers.
* **Config (`/config`)**: Manages standalone platform integrations, such as isolation files setup to secure connection hooks to MongoDB instances.

---

## ⚙️ Prerequisites & Setup Instructions

### 1. Clone & Install Dependencies
First, clone this repository locally and run the installation script to grab the core application middleware packages:
```bash
git clone https://github.com
cd my-oauth-app
npm install
```

### 2. Environment Variables Configuration
Create a file named `.env` in the absolute root folder directory. Ensure every entry resides on its **own separate row** to prevent broken string reads:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/my_oauth_app_db
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_client_id_from_cloud_console
GOOGLE_CLIENT_SECRET=your_google_client_secret_from_cloud_console
CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

### 3. Start the Server
Boot up the application framework environment:
```bash
node server.js
```
*Expected terminal verification:* `Server running on port 3000` and `MongoDB Connected...`.

---

## 🔄 The Authentication Flow: How It Works

```text
 [ User / Browser ] --------( 1. Hits /api/auth/google )--------> [ Your Express Server ]
       |                                                                  ^

       |                                                                  |
       | (2. Redirected to Sign-in Screen)                                |
       v                                                                  | (4. Exchanges Code for User Data)
 [ Google Identity Server ] <-----( 3. Auto Redirects with Code )---------+
```

1. **Initiation**: The application user hits `http://localhost:3000/api/auth/google`. Your route redirects the client browser to the official, secure Google login page.
2. **Consent & Approval**: The user fills in credentials and confirms app data access limits.
3. **The Callback Loop**: Google issues a temporary secure Authorization Code, then instantly forwards the user to your registered endpoint `CALLBACK_URL` (`/api/auth/google/callback`). 
4. **Data Synchronization**: Passport securely intercepts that incoming code parameters behind the scenes, exchanges it for profile data directly from Google, updates your local MongoDB database, and forwards execution to your controller.
5. **Token Delivery**: Your controller signs an isolated JWT session string and returns it cleanly on the final UI dashboard container layout.

---

## 🛠️ Complete API Endpoint Mapping

| HTTP Method | API Route Path | Access | Context / Purpose |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/auth/google` | Public | **Triggers the OAuth Process**. Type this route in a standard web browser to kick-start login authorization. |
| **GET** | `/api/auth/google/callback` | Google Only | **The OAuth Handshake Route**. Used automatically by Google's backend servers to send back security parameters. |
| **GET** | `/api/auth/failure` | Public | **Error Fallback**. Triggered automatically if authentication fails. |
| **GET** | `/api/auth/logout` | Protected | **Session Invalidation**. Cleans active user variables from the runtime context stack. |

---

## 🔎 How to Check & Verify the System

Follow these steps to confirm that your Google integration, server routing, and MongoDB connection are working smoothly:

### Step 1: Terminal Log Verification
When you launch the server using `node server.js` or `npm start`, look closely at your console logs. You must verify that both components initialize correctly:
* **Connection Check 1**: You should see `Server running on port 3000`. This confirms that your `.env` ports are properly bound and reading correctly.
* **Connection Check 2**: You should see `MongoDB Connected...`. This confirms that your database connection string is active and accessible.

### Step 2: Live Browser Authentication Test
Because Google's interactive login screen cannot render as HTML inside Postman's raw request panel, you must verify the handshake via a web browser:
1. Open a new browser window (use **Incognito Mode** to prevent stale session caching).
2. Enter the initiation address: `http://localhost:3000/api/auth/google`
3. Click through the Google account selector screen and sign in.
4. **The Ultimate Pass Check**: If the system works perfectly, your browser will redirect and output a clean JSON response containing a `"success": true` flag and your generated JWT token string.

### Step 3: Database Insertion Check
To ensure that your Mongoose Model is communicating with your database collection cluster:
1. Open your database GUI client (like **MongoDB Compass**) or use your terminal shell wrapper.
2. Access the database named `my_oauth_app_db`.
3. Open the `users` collection.
4. Verify that a new user record containing your Google profile attributes (`googleId`, `email`, and `username`) has been automatically created.

### Step 4: Token Authentication Test in Postman
To verify that your viewless API can accept and read your newly generated credentials:
1. Copy the long token string (including the word `Bearer `) from your browser validation response screen.
2. Open **Postman** and create a new request tab.
3. Move to the request **Authorization** configurations tab located below the main URL bar.
4. Change the dropdown authentication mechanism **Type** to **Bearer Token**.
5. Paste your copied credential value string straight into the **Token** field box wrapper and execute your API calls.
