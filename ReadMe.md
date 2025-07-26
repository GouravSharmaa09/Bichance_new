# DinnerConnect

DinnerConnect is a platform to connect 5–6 strangers for a weekly Wednesday dinner, matched through a personality algorithm. Inspired by [TimeLeft](https://timeleft.com), this platform focuses on building meaningful offline connections in a minimalist, no-chat format.

---

## 🚀 Features

- ✅ OTP-based email login (passwordless authentication)
- ✅ Personality-based group matching via 21-question survey
- ✅ Weekly dinner booking (Wednesdays only)
- ✅ Subscription-based access (1, 3, 6 months)
- ✅ Admin-controlled group formation and restaurant selection
- ✅ Feedback-only inbox (post-dinner)
- ❌ No in-app chat to keep it intentional

---

## 🏗 Tech Stack

### Frontend

- [Next.js](https://nextjs.org/) (React-based SSR framework)
- [Jotai](https://jotai.org/) (State management)
- Tailwind CSS (UI styling)

### Backend

- [FastAPI](https://fastapi.tiangolo.com/) with [Pydantic](https://docs.pydantic.dev/)
- MongoDB (via Motor or ODM)
- AWS S3 (media uploads)
- SMTP/SendGrid (email OTPs & notifications)

### Integrations

- Stripe (subscriptions)
- OpenAPI + Swagger Docs (`/docs`)
- Cron jobs (group matchmaking every Tuesday 6 PM IST)

---

## 🧭 Folder Structure

```
dinnerconnect/
├── apps/
│   ├── frontend/        # Next.js app
│   └── backend/         # FastAPI app
├── libs/                # Shared schemas, logic, utilities
├── docker/              # Docker configs
├── scripts/             # Utility scripts & CRON jobs
└── README.md            # This file
```

---

## 📦 Installation

### 1. Clone the Repo

```bash
git clone https://github.com/your-org/dinnerconnect.git
cd dinnerconnect
```

### 2. Set Up Frontend

```bash
cd apps/frontend
npm install
npm run dev
```

### 3. Set Up Backend

```bash
cd apps/backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 4. Generate API Types in Frontend

```bash
cd apps/frontend
npm run gen:api
```

> Uses `openapi-typescript` to pull from FastAPI's `/openapi.json`

---

## 🔄 Matchmaking Logic

- Matchmaking script runs every **Tuesday at 6 PM IST**
- Matches users based on city, availability, personality score proximity
- Forms groups of 5–6 and assigns a restaurant

You can manually run it from:

```bash
POST /admin/matchmaking/run
```

---

## 🔐 Admin Panel Features

- View KPIs (Bookings, Revenue, Feedback)
- Edit user bookings
- Manage restaurant pools
- Manually trigger matchmaking
- Read all feedback reports

---

## 🧪 API Testing

- Swagger UI → `http://localhost:8000/docs`
- Redoc UI → `http://localhost:8000/redoc`
- OpenAPI JSON → `/openapi.json`

---

## ✨ Contribution Guide

1. Fork the repo
2. Set up `.env` files (see `.env.example` in each app)
3. Use type-safe DTOs via shared OpenAPI schema
4. Write unit tests in `apps/backend/app/services/matchmaking/test_*.py`
5. Submit PR with meaningful commits

---

## 📜 License

MIT License — open for community enhancements.

---

## 💡 TODOs (Future Enhancements)

- [ ] Google Calendar integration
- [ ] RSVP deadline handling
- [ ] Public Dinner Archive with anonymized testimonials
- [ ] Group photo auto-upload post dinner (optional)

---

Built with ❤️ to help strangers become real-world friends.

> “Real magic happens when humans meet offline.”
