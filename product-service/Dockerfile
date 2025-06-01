# Utilisation d'une image minimale et sécurisée
FROM python:3.12-alpine

# Définir le dossier de travail
WORKDIR /app

# Installer les dépendances système nécessaires
RUN apk add --no-cache gcc musl-dev libffi-dev

# Copier les fichiers nécessaires
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste des fichiers
COPY . .

# Exposer le port utilisé par Flask (5001 pour ce microservice)
EXPOSE 5001

# Commande de lancement avec Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app"]
