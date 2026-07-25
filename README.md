# 🩺 HealthMate AI
### AI-Based Diabetes Prediction & Personalized Diet Recommendation System

> **Final Year Project** — Full-Stack Healthcare Web Application  
> Built with Python Django 5 + Machine Learning (Random Forest, XGBoost, Logistic Regression)

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| 🏠 Home | Landing page with feature highlights |
| 📊 Dashboard | Stats, charts, latest result |
| 🔬 Prediction | ML-powered health assessment form |
| ✅ Result | Diagnosis + Risk gauge + Diet plan |
| 🥗 Diet Plans | Personalized meal recommendations |
| 📈 Analytics | Health trend charts |
| 📄 PDF Report | Downloadable health report |

---

## 🚀 Quick Start

### 1. Clone / Extract the Project
```bash
cd healthmate_ai
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Train the ML Model
```bash
python machine_learning/train_model.py
```
This trains 3 models (Logistic Regression, Random Forest, XGBoost), compares accuracy, and saves the best one as `model.pkl`.

### 5. Apply Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser
```bash
python manage.py createsuperuser
```

### 7. Collect Static Files
```bash
python manage.py collectstatic
```

### 8. Run Development Server
```bash
python manage.py runserver
```

Open: **http://127.0.0.1:8000**

---

## 📁 Project Structure

```
healthmate_ai/
│
├── manage.py
├── requirements.txt
├── README.md
│
├── healthmate_ai/           # Project config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── accounts/                # Auth module
│   ├── models.py            # CustomUser, OTPVerification
│   ├── views.py             # Login, Signup, OTP, Profile
│   ├── forms.py
│   └── urls.py
│
├── dashboard/               # Analytics dashboard
│   ├── views.py             # Stats + Chart data
│   └── urls.py
│
├── prediction/              # ML prediction engine
│   ├── models.py            # Prediction model
│   ├── views.py
│   ├── forms.py
│   ├── ml_utils.py          # Load model & predict
│   └── urls.py
│
├── diet/                    # Diet recommendation
│   ├── models.py            # DietPlan model
│   ├── views.py
│   ├── utils.py             # Diet generation logic
│   └── urls.py
│
├── reports/                 # PDF report generation
│   ├── models.py
│   ├── views.py             # ReportLab PDF builder
│   └── urls.py
│
├── core/                    # Home page
│   ├── views.py
│   └── urls.py
│
├── machine_learning/        # ML files
│   ├── train_model.py       # Training script
│   ├── model.pkl            # Saved best model
│   └── dataset.csv          # PIMA-like dataset
│
├── static/
│   ├── css/healthmate.css   # Custom styles
│   └── js/healthmate.js     # JS utilities + charts
│
└── templates/
    ├── base.html            # Sidebar layout
    ├── core/home.html
    ├── accounts/
    │   ├── login.html
    │   ├── signup.html
    │   ├── profile.html
    │   ├── send_otp.html
    │   └── verify_otp.html
    ├── dashboard/
    │   ├── home.html
    │   └── analytics.html
    ├── prediction/
    │   ├── predict.html
    │   ├── result.html
    │   └── history.html
    └── diet/
        ├── list.html
        └── detail.html
```

---

## 🤖 Machine Learning

### Models Trained
| Model | Accuracy |
|-------|----------|
| Logistic Regression | ~74% |
| Random Forest | **~84%** ✅ Best |
| XGBoost | ~84% |

### Dataset
- Based on **PIMA Indians Diabetes Dataset** structure
- 768 samples, 8 features + 1 outcome
- Features: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age

### Input Features
| Feature | Description | Unit |
|---------|-------------|------|
| Pregnancies | Number of pregnancies | Count |
| Glucose | Plasma glucose (2-hr oral test) | mg/dL |
| Blood Pressure | Diastolic BP | mmHg |
| Skin Thickness | Triceps skinfold | mm |
| Insulin | 2-hr serum insulin | mu U/ml |
| BMI | Body Mass Index | kg/m² |
| Diabetes Pedigree | Family history score | 0–2.5 |
| Age | Patient age | Years |

---

## 🗄️ Database Models

### CustomUser
```python
id, username, first_name, last_name, email, phone, language, 
profile_picture, date_of_birth, gender
```

### Prediction
```python
id, user(FK), pregnancies, glucose, blood_pressure, skin_thickness,
insulin, bmi, diabetes_pedigree, age, prediction, risk_score, 
model_used, created_at
```

### DietPlan
```python
id, user(FK), prediction(FK), recommendation(JSONField), created_at
```

### HealthReport
```python
id, user(FK), prediction(FK), report_file, created_at
```

---

## 🌐 URL Routes

| URL | View | Description |
|-----|------|-------------|
| `/` | core:home | Landing page |
| `/accounts/login/` | accounts:login | Login |
| `/accounts/signup/` | accounts:signup | Register |
| `/accounts/logout/` | accounts:logout | Logout |
| `/accounts/profile/` | accounts:profile | User profile |
| `/accounts/send-otp/` | accounts:send_otp | Send OTP |
| `/accounts/verify-otp/` | accounts:verify_otp | Verify OTP |
| `/dashboard/` | dashboard:home | Main dashboard |
| `/dashboard/analytics/` | dashboard:analytics | Analytics |
| `/prediction/` | prediction:predict | New prediction |
| `/prediction/result/<pk>/` | prediction:result | View result |
| `/prediction/history/` | prediction:history | Past predictions |
| `/diet/` | diet:list | Diet plans list |
| `/diet/<pk>/` | diet:detail | Diet plan detail |
| `/reports/generate/<pk>/` | reports:generate | Download PDF |
| `/admin/` | Django Admin | Admin panel |

---

## 🎨 UI Features

- **Outfit font** — Modern, clean typography
- **Dark/Light mode** — Toggle with localStorage persistence
- **Responsive sidebar** — Collapsible on mobile
- **Animated stats** — Number counter animations
- **Chart.js** — Line, Bar, Doughnut charts
- **Risk Gauge** — Canvas-based semicircle gauge
- **Color-coded status** — 🟢 Normal, 🟡 Warning, 🔴 High Risk
- **PDF Reports** — ReportLab-generated professional PDFs
- **3 Languages** — EN / Telugu / Hindi labels

---

## 🚢 Production Deployment

### PostgreSQL Setup
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'healthmate_db',
        'USER': 'your_user',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Environment Variables (`.env`)
```
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgres://user:pass@host:5432/dbname
```

### Gunicorn + Nginx
```bash
# Install gunicorn
pip install gunicorn whitenoise

# Run
gunicorn healthmate_ai.wsgi:application --bind 0.0.0.0:8000 --workers 3
```

### Nginx Config (Ubuntu)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /static/ {
        alias /path/to/healthmate_ai/staticfiles/;
    }

    location /media/ {
        alias /path/to/healthmate_ai/media/;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 👤 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Admin@123` |

**Change the password immediately in production!**

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, Django 5 |
| ML | scikit-learn, XGBoost, pandas, numpy, joblib |
| Frontend | Bootstrap 5.3, Chart.js 4, Outfit (Google Fonts) |
| PDF | ReportLab |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | Django Auth + OTP Verification |
| Images | Pillow |

---

## ⚠️ Disclaimer

> This application is built for **educational / final year project purposes only**.  
> It is **NOT** a substitute for professional medical advice, diagnosis, or treatment.  
> Always consult a qualified healthcare professional for medical decisions.

---

## 📧 Support

Built as a Final Year Project — AI-Based Diabetes Prediction and Personalized Diet Recommendation System using Python Django + Machine Learning.

**HealthMate AI © 2024**
