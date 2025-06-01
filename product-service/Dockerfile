# Étape 1 : Build - installation des dépendances
FROM python:3.11-slim-bookworm AS builder

# Variables d'environnement pour éviter les fichiers pyc et buffer flush
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Mise à jour des dépôts et installation des dépendances système
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libc6 \
    libc-bin \
    perl-base \
    zlib1g \
    && rm -rf /var/lib/apt/lists/*

# Création d'un répertoire de travail
WORKDIR /app

# Copier requirements.txt et installer les dépendances dans un dossier isolé
COPY requirements.txt .

# Mettre à jour pip et installer setuptools avec une version plus récente, puis les dépendances
RUN pip install --upgrade pip && \
    pip install --prefix=/install setuptools==72.0.0 && \
    pip install --prefix=/install -r requirements.txt

# Étape 2 : Image finale allégée
FROM python:3.11-slim-bookworm

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
