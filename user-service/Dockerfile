# Étape 1 : Build - installation des dépendances
FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip \
    && pip install --prefix=/install -r requirements.txt

# Étape 2 : Image finale allégée
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY --from=builder /install /usr/local

COPY . /app

EXPOSE 5000

RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

CMD ["python", "app.py"]
