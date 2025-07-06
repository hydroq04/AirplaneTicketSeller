# AirplaneTicketSeller
This is our final project of Introduction to Software Engineering (HCMUS - 2025), built using React, Vite, JavaScript and MongoDB.

Install all depandencies inside each part beforehand.  
Edit the `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` and `VITE_CLIENT_URL` inside the `.env` file. `MONGO_URI` key can be obtained from MongoDB Atlas Cluster. `CLIENT_URL` and `VITE_CLIENT_URL` must be equivalent.

-----

To build this website, go to **Command Prompt** or **Powershell** and run this

**In Windows Command Prompt/Powershell:**
```
echo Build the website UI
cd frontend
npm init -y
npm install
npm run build

echo Move the built website to backend folder
move dist ../backend
cd ../backend
ren dist client

echo Launch the server
npm install
node ./src/server.js 
```
