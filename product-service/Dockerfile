# Étape 1 : Build - installation des dépendances
FROM python:3.11-slim AS builder

# Variables d'environnement pour éviter les fichiers pyc et buffer flush
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Installation des dépendances système requises pour pymongo et flask-pymongo
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Création d'un répertoire de travail
WORKDIR /app

# Copier requirements.txt et installer les dépendances dans un dossier isolé
COPY requirements.txt .

RUN pip install --upgrade pip \
    && pip install --prefix=/install -r requirements.txt

# Étape 2 : Image finale allégée
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copier les dépendances installées depuis l'étape builder
COPY --from=builder /install /usr/local

# Copier le code de l'application
COPY . /app

# Port exposé
EXPOSE 5001

# Définir l'utilisateur non root pour plus de sécurité
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

# Commande par défaut pour lancer l'application
CMD ["python", "app.py"]
