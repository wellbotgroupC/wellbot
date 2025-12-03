# WellBot – Wellness Guide (Mini Doctor)

Full-stack bilingual (English / Telugu) app that:
- Lets users register, login, view profile
- Opens a black-theme **chat engine** for health/diet advice
- Saves chat logs per user in MongoDB
- Has an **admin dashboard** with analytics + CSV export

## Tech

- Frontend: React + Vite, i18next, axios, React Router
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- Auth: JWT in headers
- Lang: English / Telugu UI and bot responses

## Run (dev)

```bash
# from root
npm install
cd server && npm install
cd ../client && npm install

# copy env
cd ..
cp .env.example server/.env

# seed admin + sample data
cd server
npm run seed

# run dev (backend + frontend)
cd ..
npm run dev
