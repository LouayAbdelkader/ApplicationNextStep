# Utiliser une image légère et sécurisée
FROM python:3.12-slim

# Définir les variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Mettre à jour les paquets et installer les dépendances système nécessaires
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
        gcc \
        libffi-dev \
        libssl-dev \
        libpq-dev \
        build-essential \
        curl \
        && rm -rf /var/lib/apt/lists/*

# Créer un utilisateur non-root
RUN useradd -m -s /bin/bash flaskuser

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code source de l'application
COPY . .

# Donner les droits appropriés
RUN chown -R flaskuser:flaskuser /app

# Passer à l'utilisateur non-root
USER flaskuser

# Exposer le port
EXPOSE 5001

# Commande de lancement
CMD ["python", "app.py"]
