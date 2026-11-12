FROM php:8.3-fpm-alpine

# Arguments pour l'environnement
ARG APP_ENV=prod
ARG DATABASE_URL

ENV APP_ENV=${APP_ENV}
ENV DATABASE_URL=${DATABASE_URL}

RUN apk --no-cache add \
        git \
        icu-dev \
        libzip-dev \
        zlib-dev \
        mysql-client \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
    && git config --global --add safe.directory /var/www/html \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        gd \
        intl \
        pdo_mysql \
        zip \
        opcache

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY .env.dist .env

RUN echo "--- CONTENU DU FICHIER .env DANS LE BUILD ---" && cat .env && echo "--- FIN DU CONTENU ---"

COPY composer.json composer.lock ./

# Installez les dépendances SANS exécuter les scripts
RUN composer install --no-dev --no-interaction --optimize-autoloader --no-scripts

COPY . .

# Maintenant que tous les fichiers sont là, exécutez les scripts post-install
RUN composer run-script post-install-cmd

# Assurez-vous que les permissions sont correctes
RUN chown -R www-data:www-data /var/www/html/var

COPY config/jwt /var/www/html/config/jwt/
RUN chown -R www-data:www-data /var/www/html/config/jwt

# Configuration de sécurité PHP
RUN printf "display_errors = Off\ndisplay_startup_errors = Off\nexpose_php = Off\nlog_errors = On\n" > /usr/local/etc/php/conf.d/security.ini

CMD ["php-fpm"]
EXPOSE 9000