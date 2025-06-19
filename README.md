# AirplaneTicketSeller
This is our final project of Introduction to Software Engineering (HCMUS - 2025), built using React, Vite, JavaScript and MongoDB.

Install all depandencies inside each part beforehand.  
Inside `backend/src`, create a `.env` file and add this content:
```
NODE_ENV=development
PORT=suitable_port
MONGO_URI=mongodb+srv://[username:password@]hostname[/[defaultauthdb][?options]]
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLIENT_URL=company_url
```
`MONGO_URI` key can be obtained from MongoDB Atlas Cluster.

-----

To build this website, go to **Command Prompt** or **Powershell** and run this

**In Windows Command Prompt/Powershell:**
```
echo Build the website UI
cd frontend
npm run build
move dist ../backend

echo Move the built website to backend folder
cd ../backend
ren dist frontend

echo Launch the server
node app.js 
```
