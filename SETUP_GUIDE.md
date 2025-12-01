# Complete Setup Guide - WhatsApp Clone

Follow these steps to run the project on your local machine.

## Prerequisites

Before starting, make sure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A **Supabase account** (free) - [Sign up here](https://supabase.com)
- **Git** installed

## Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/sumirakhatiwoda23/whatsapp-clone.git
cd whatsapp-clone
```

### Step 2: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - Project name: `whatsapp-clone`
   - Database password: (create a strong password)
   - Region: (choose closest to you)
4. Click **"Create new project"** (wait 2-3 minutes)

5. Once created, click **"SQL Editor"** in the left sidebar
6. Click **"New query"**
7. Copy and paste this SQL code:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "from" UUID REFERENCES users(id) NOT NULL,
  "to" UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'sent'
);

-- Create indexes for better performance
CREATE INDEX idx_messages_from ON messages("from");
CREATE INDEX idx_messages_to ON messages("to");
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
```

8. Click **"Run"** button (or press Ctrl+Enter)
9. You should see "Success. No rows returned"

### Step 3: Get Supabase Credentials

1. In Supabase dashboard, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. You'll see:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)
4. Keep this tab open - you'll need these values

### Step 4: Configure Environment Variables

1. In your project folder, create a `.env` file:

```bash
# On Mac/Linux:
cp .env.example .env

# On Windows:
copy .env.example .env
```

2. Open `.env` file in a text editor and update:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Change this to a random secret string
JWT_SECRET=my-super-secret-key-12345

# Paste your Supabase URL here
SUPABASE_URL=https://xxxxx.supabase.co

# Paste your Supabase anon key here
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file

### Step 5: Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

This will take 2-3 minutes.

### Step 6: Run the Application

Open **TWO terminal windows** in the project folder:

**Terminal 1 - Start Backend Server:**
```bash
npm run server
```

You should see:
```
Server running on port 5000
```

**Terminal 2 - Start Frontend:**
```bash
npm run client
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### Step 7: Open the App

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the WhatsApp Clone login page!

## Testing the App

### Create Two Users

1. Click **"Sign up"**
2. Create first user:
   - Name: `Alice`
   - Email: `alice@test.com`
   - Password: `password123`
3. Click **"Sign Up"**
4. You'll be logged in

5. Open a **new incognito/private window**
6. Go to **http://localhost:3000**
7. Create second user:
   - Name: `Bob`
   - Email: `bob@test.com`
   - Password: `password123`

### Send Messages

1. In Alice's window, click on **Bob** in the user list
2. Type a message and press Enter
3. In Bob's window, you should see the message appear instantly!
4. Bob can reply, and Alice will see it in real-time

## Alternative: Run Both Together

Instead of two terminals, you can run both server and client together:

```bash
npm run dev
```

This starts both frontend and backend simultaneously.

## Troubleshooting

### Port Already in Use

If you see "Port 5000 is already in use":

**Mac/Linux:**
```bash
lsof -ti:5000 | xargs kill -9
```

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Cannot Connect to Database

- Check your `.env` file has correct Supabase credentials
- Make sure you ran the SQL commands in Supabase
- Verify your internet connection

### Module Not Found Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules client/node_modules
npm install
cd client && npm install && cd ..
```

### Socket Connection Failed

- Make sure backend server is running on port 5000
- Check browser console for errors
- Verify `CLIENT_URL` in `.env` is `http://localhost:3000`

## Project Structure

```
whatsapp-clone/
├── client/              # React frontend (port 3000)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Login, Register, Chat
│   │   ├── store/       # State management
│   │   └── hooks/       # Socket.io hook
│   └── package.json
├── server/              # Node.js backend (port 5000)
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication
│   └── index.js         # Server entry
├── .env                 # Your credentials (DO NOT COMMIT)
├── .env.example         # Template
└── package.json
```

## What's Running?

- **Frontend (React)**: http://localhost:3000
- **Backend (Express)**: http://localhost:5000
- **Socket.io**: Real-time messaging on port 5000
- **Database**: Supabase (cloud PostgreSQL)

## Next Steps

Once everything works:
- ✅ Try sending messages between users
- ✅ Check online/offline status
- ✅ Test emoji picker
- ✅ Open multiple browser tabs to simulate multiple users

## Need Help?

Common issues:
1. **"Cannot find module"** → Run `npm install` again
2. **"Port in use"** → Kill the process or change port in `.env`
3. **"Database error"** → Check Supabase credentials in `.env`
4. **"Socket not connecting"** → Ensure backend is running first

## Stop the Application

Press **Ctrl + C** in both terminal windows to stop the servers.

---

**Congratulations! Your WhatsApp clone is now running! 🎉**