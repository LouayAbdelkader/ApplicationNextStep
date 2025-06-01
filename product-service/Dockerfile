# Étape 1 : Utiliser une image Python officielle légère
FROM python:3.12-slim

# Étape 2 : Créer un utilisateur non-root
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Étape 3 : Définir le répertoire de travail
WORKDIR /app

# Étape 4 : Copier uniquement ce qui est nécessaire
COPY requirements.txt .

# Étape 5 : Installer les dépendances de manière sécurisée
RUN pip install --no-cache-dir -r requirements.txt

# Étape 6 : Copier le reste du code de l’application
COPY . .

# Étape 7 : Changer le propriétaire des fichiers
RUN chown -R appuser:appgroup /app

# Étape 8 : Droits d’exécution minimaux (non-root)
USER appuser

# Étape 9 : Variables d’environnement de base (sécurisé via docker-compose ou secrets en prod)
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Étape 10 : Exposer uniquement le port nécessaire
EXPOSE 5001

# Étape 11 : Commande d'exécution (production avec Gunicorn pour + sécurité)
CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]
