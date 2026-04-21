FROM nginx:stable-alpine3.23-perl
LABEL maintainer="surya"
WORKDIR /usr/share/nginx/html
RUN rm -rf *.html
ADD dist/frontend/browser/ .
EXPOSE 80