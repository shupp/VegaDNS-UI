FROM nginx:alpine

ADD . /opt/vegadns
WORKDIR /opt/vegadns

RUN apk add --update --virtual build-dependancies git bash nodejs \
  && ./build.sh \
  && rm -rf node_modules \
  && apk del build-dependancies
RUN rm -rf /usr/share/nginx/html/ && \
  ln -s /opt/vegadns/public /usr/share/nginx/html
