# Étape 1 : Builder (pour les dépendances compilées)
FROM python:3.11-slim AS builder

# Éviter les fichiers pyc et forcer le flush stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Installer uniquement les outils nécessaires pour builder les dépendances
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Installer les dépendances dans un dossier temporaire
COPY requirements.txt .

RUN python -m venv /venv \
    && /venv/bin/pip install --upgrade pip \
    && /venv/bin/pip install -r requirements.txt

---

# Étape 2 : Image finale minimaliste
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/venv/bin:$PATH"

WORKDIR /app

# Copier l'environnement virtuel minimal (réduit la surface d'attaque)
COPY --from=builder /venv /venv

# Copier le code de l'application
COPY . /app

# Créer un utilisateur non-root sécurisé
RUN adduser --disabled-password --gecos '' appuser \
    && chown -R appuser /app

USER appuser

EXPOSE 5001

CMD ["python", "app.py"]
