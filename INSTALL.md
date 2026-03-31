# Install services manually

## Core server

[How to install the core server](./core-server/INSTALL.md)

## Web client and Media server

All the following instruction and exemple assume you cloned this repository in `/srv`

### Install Apache2 and PHP
```sh
sudo apt-get install apache2-utils apache2 php libapache2-mod-php php-json php-zip php-curl php-gd -y
```

```sh
sudo systemctl enable apache2
```

```sh
sudo a2enmod headers
```

```sh
sudo a2enmod rewrite
```

### Create new VirtualHost
```sh
sudo cp ./revoicechat.conf.exemple /etc/apache2/sites-available/revoicechat.conf
```

**Cache-Control** can be set to **max-age=86400, must-revalidate**

Make sure **/var/log/revoicechat/** exist and apache2 can write to it

Enable **VirtualHost**
```sh
sudo a2ensite revoicechat.conf
```
```sh
sudo systemctl reload apache2
```

### Copy PHP config

```sh
cp ./media-server/settings.ini.exemple ./media-server/settings.ini
```

## Troubleshooting

If you get apache2 default page, you need to disable the default config

```sh
sudo a2dissite 000-default.conf
```
```sh
sudo systemctl reload apache2
```

# Configure reverse proxy

We recommend using [Nginx Proxy Manager](https://nginxproxymanager.com/).

### Routes

Assuming you are using `revoicechat.yourdomain.me` , here is the table of routes : 

Destination | IP | Port
---|---|---
revoicechat.yourdomain.me/* | IP of WebClient | 80
revoicechat.yourdomain.me/api | IP of CoreServer | 8080
revoicechat.yourdomain.me/media | IP of MediaServer | 88

### Configuring Nginx Proxy Manager

Add a new proxy host with the following :

#### Details
- Domain names : `revoicechat.yourdomain.me`
- Scheme : `http`
- Forward Hostname / IP : `IP of WebClient`
- Forward Port : `80`
- Websockets support : `enable`

#### Custom locations
##### `/api`
- Location : `/api`
- Scheme : `http`
- Forware Hostname/IP : `IP of CoreServer`
- Forward Port : `8080`
- Advance (click on the cog) : 
```nginx
proxy_hide_header 'Access-Control-Allow-Origin';
proxy_hide_header 'Access-Control-Allow-Credentials';
proxy_hide_header 'Access-Control-Allow-Headers';
proxy_hide_header 'Access-Control-Allow-Methods';

add_header 'Access-Control-Allow-Origin' '*';
add_header 'Access-Control-Allow-Credentials' 'true';
add_header 'Access-Control-Allow-Headers' 'Authorization,Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS,PUT,DELETE,PATCH';

proxy_read_timeout 8h;
```

##### `/media`

- Location : `/media`
- Scheme : `http`
- Forware Hostname/IP : `IP of MediaServer`
- Forward Port : `88` (default for the VirtualHost)
- Advance :
```nginx
proxy_set_header  Authorization $http_authorization;
proxy_pass_header Authorization;

client_max_body_size 120M;

# Rate limiter (optionnal)
limit_rate 15000k;
limit_rate_after 5000k; 

# Remove header
proxy_hide_header 'Access-Control-Allow-Headers';
proxy_hide_header 'Access-Control-Allow-Origin';
proxy_hide_header 'Access-Control-Allow-Credentials';
proxy_hide_header 'Access-Control-Allow-Methods';

# CORS headers
add_header 'Access-Control-Allow-Origin' '*' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;

# OPTIONS preflight
if ($request_method = OPTIONS) {
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, PATCH, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    add_header 'Access-Control-Max-Age' 1728000 always;
    add_header 'Content-Length' 0 always;
    add_header 'Content-Type' 'text/plain; charset=UTF-8' always;
    return 204;
}
```

#### SSL
- You may want to add SSL, if so, enable `Force SSL` and `HTTP/2 Support`

#### Advanced

- None