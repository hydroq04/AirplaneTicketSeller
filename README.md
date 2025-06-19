# AirplaneTicketSeller
This is our final project of Introduction to Software Engineering (HCMUS - 2025), built using React, Vite, JavaScript and MongoDB.

Install all depandencies inside each part beforehand.

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
