# WhatsApp Clone

A full-stack real-time messaging application built with React, Node.js, Socket.io, and Supabase.

## Features

- 🔐 User authentication (register/login)
- 💬 Real-time messaging with Socket.io
- 👥 User list with online status
- ✅ Message delivery status
- 😊 Emoji picker
- 📱 Responsive design
- 🎨 WhatsApp-inspired UI

## Tech Stack

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Socket.io Client
- Zustand (state management)
- React Router

**Backend:**
- Node.js
- Express
- Socket.io
- JWT authentication
- Supabase (PostgreSQL)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/sumirakhatiwoda23/whatsapp-clone.git
cd whatsapp-clone
```

### 2. Set up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run these SQL commands in the Supabase SQL editor:

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

### 3. Configure environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase credentials:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-this
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key
```

### 4. Install dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 5. Run the application

```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
# Terminal 1 - Server
npm run server

# Terminal 2 - Client
npm run client
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment

### Deploy to Railway

1. Push your code to GitHub
2. Connect your GitHub repo to Railway
3. Add environment variables in Railway dashboard
4. Deploy!

### Deploy Frontend to Vercel

```bash
cd client
npm run build
# Deploy the dist folder to Vercel
```

## Project Structure

```
whatsapp-clone/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                # Node.js backend
│   ├── middleware/        # Auth middleware
│   ├── routes/           # API routes
│   └── index.js          # Server entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users (except current)
- `GET /api/users/:id` - Get user by ID

### Messages
- `GET /api/messages/:userId` - Get messages with specific user
- `POST /api/messages` - Save message to database

### Socket Events
- `send_message` - Send message to user
- `receive_message` - Receive message from user
- `typing` - User typing indicator
- `online_users` - List of online users
- `user_online` - User came online
- `user_offline` - User went offline

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

MIT

## Author

Sumira Khatiwoda