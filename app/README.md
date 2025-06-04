# Project Setup & Database Migration Guide

This guide will help you:
- Set up a virtual environment
- Install project dependencies
- Configure and use Alembic for database migrations

---

## 🔧 1. Set Up a Virtual Environment

### ✅ On Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

### ✅ On Windows

```bash
python -m venv venv
venv\Scripts\activate
```

---

## 📦 2. Install Dependencies

Make sure you have a `requirements.txt` file. Then run:

```bash
pip install -r requirements.txt
```

If you don’t have a `requirements.txt` yet, create one with:

```bash
pip freeze > requirements.txt
```

---

## 🔄 3. Alembic Setup

Alembic is used to manage schema migrations for SQLAlchemy-based applications.

### Step-by-Step

### ✅ Step 1: Install Alembic

```bash
pip install alembic
```

### ✅ Step 2: Initialize Alembic in your project

```bash
alembic init alembic
```

This creates an `alembic/` directory and an `alembic.ini` config file.

---

## ⚙️ 4. Configure Alembic

### ✅ Update `alembic.ini`

Edit the `sqlalchemy.url` line to match your database connection string
Currently we override the ini setting for db url in alembic/env.py by using .env file variable

```ini
sqlalchemy.url = sqlite:///./test.db
# or for PostgreSQL:
# sqlalchemy.url = postgresql://user:password@localhost/dbname
```

### ✅ Update `alembic/env.py`

Replace:

```python
target_metadata = None
```

With:

```python
from your_project.models import EntityBase  # Replace with your actual import
target_metadata = EntityBase.metadata
```

This allows Alembic to detect changes in your SQLAlchemy models.

---

## 📜 5. Creating & Running Migrations

### ✅ Create a Migration Script (Auto-Detect Changes)

```bash
alembic revision --autogenerate -m "Initial migration"
```

### ✅ Apply the Migration to the Database

```bash
alembic upgrade head
```

### ⬅️ Downgrade (Rollback) Last Migration

```bash
alembic downgrade -1
```

---

## 📁 Project Structure Example

```
your_project/
├── alembic/
│   └── versions/
├── entities/
│   └── __init__.py  # contains EntityBase and your models
├── alembic.ini
├── main.py
└── requirements.txt
```

---

## 🧪 Tips

- Always activate your virtual environment before running Alembic commands.
- Commit your `alembic/versions/` files so your DB schema changes are tracked with code.
- You can chain migrations using `upgrade head`, or step back one-by-one with `downgrade -1`.

---

## 📌 Common Commands

| Action                     | Command                                   |
|----------------------------|-------------------------------------------|
| Create migration script    | `alembic revision --autogenerate -m "msg"`|
| Apply latest migration     | `alembic upgrade head`                    |
| Downgrade last migration   | `alembic downgrade -1`                    |
| View current revision      | `alembic current`                         |
| Show migration history     | `alembic history`                         |

---

## ✅ Done!
You're now set up to manage your database schema using Alembic 🚀


## ▶️ How to Run the App

### 1. **Start in Detached Mode (Background)**
```bash
docker-compose up -d --build
```

- Builds the FastAPI app container and starts MySQL.
- `-d` = detached mode (runs in background).
- `--build` ensures everything is up to date.

## 📝 Alembic Migrations

To apply migrations **after containers are running**:
```bash
docker-compose exec api alembic upgrade head
```

To check current Alembic status:
```bash
docker-compose exec api alembic current
```

## 📺 Viewing Logs

To follow logs in real-time:
```bash
docker-compose logs -f
```

To view logs for a specific service (e.g., MySQL or FastAPI):
```bash
docker-compose logs -f db
docker-compose logs -f api
```

## 🧨 Tear Down Everything

### Completely remove containers, volumes, and images:
```bash
docker-compose down -v --rmi all
```

This will:
- Stop and remove all containers
- Delete volumes (like MySQL data)
- Delete all images (including app build)

## 🔄 Rebuild from Scratch

If you want a clean rebuild:
```bash
docker-compose down -v --rmi all
docker-compose up -d --build
docker-compose exec api alembic upgrade head
```
