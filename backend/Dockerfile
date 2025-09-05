FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    postgresql-dev \
    git \
    zip \
    unzip \
    bash \
    supervisor \
    libpq

RUN docker-php-ext-install pdo pdo_pgsql

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html

COPY --chown=www-data:www-data . /var/www/html