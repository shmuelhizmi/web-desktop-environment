FROM ubuntu:20.04

WORKDIR /usr/src/web-desktop-environment

COPY . .


# all necessaries for next RUN
RUN set -e; \
    apt-get update && \
    apt-get install -qqy --no-install-recommends \
    apt-get --assume-yes --no-install-recommends install xpra \
    curl wget nano gnupg2 software-properties-common && \
    rm -rf /var/lib/apt/lists;


RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

# uncomment for checking versions
  # Step 4/10 : RUN apt-cache show nodejs | grep Version;return 1;
  #  ---> Running in xxxxxxxxx
  # Version: 14.18.2-deb-1nodesource1
  # Version: 10.19.0~dfsg-3ubuntu1
#RUN apt-cache show nodejs | grep Version;return 1;

RUN set -e; \
    apt-get update && \
    apt-get install -qqy \
    nodejs build-essential && \
    rm -rf /var/lib/apt/lists;


RUN npm install -g yarn
RUN yarn
RUN apt-get update && apt-get -y install xpra && apt-get -y --purge autoremove && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
RUN alias ui='xpra start :10 --pulseaudio=no --start-child="$*" --bind-tcp=0.0.0.0:9400 --no-daemon --exit-with-children'

EXPOSE 5000
EXPOSE 3000
EXPOSE 9200-9400

CMD ["npm", "run", "dev:server:dev"]