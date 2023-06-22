
npm run dev
ssh killuh@164.92.104.164


# TODO

Need to setup webhooks for Customer delete.
 - When a customer deletes their account, we need to remove the id from OUR DB



Customers can cancel subscriptions any time to prevent further billing but no refunds will be given.


Need to setup subscriptions webhook to update user account
    - onRenew
        - Update sub_end_date


Need a job setup to check OUR db for sub_end_dates and set subscribed=False when SUB has expired.



customer_id
subscribed
sub_end_date



OZB29D7AUVVNV817M2XTKSMVEZZIT3RB




# Django Gunicorn

gunicorn --bind 0.0.0.0:8000 myproject.wsgi

https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-20-04

sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx curl

sudo ufw allow 8000


# Nginx

sudo systemctl stop nginx
sudo systemctl start nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl disable nginx
sudo systemctl enable nginx

## Install Nginx
sudo apt update
sudo apt install nginx
sudo ufw allow 'Nginx Full'



systemctl daemon-reload

## Restart Nginx
sudo nano /etc/nginx/sites-available/backend
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx


## Content
     - /var/www/html: The actual web content, which by default only consists of the default Nginx page you saw earlier, is served out of the /var/www/html directory. This can be changed by altering Nginx configuration files.
## Server Configuration
     - /etc/nginx: The Nginx configuration directory. All of the Nginx configuration files reside here.
     - /etc/nginx/nginx.conf: The main Nginx configuration file. This can be modified to make changes to the Nginx global configuration.
     - /etc/nginx/sites-available/: The directory where per-site server blocks can be stored. Nginx will not use the configuration files found in this directory unless they are linked to the sites-enabled directory. Typically, all server block configuration is done in this directory, and then enabled by linking to the other directory.
     - /etc/nginx/sites-enabled/: The directory where enabled per-site server blocks are stored. Typically, these are created by linking to configuration files found in the sites-available directory.
     - /etc/nginx/snippets: This directory contains configuration fragments that can be included elsewhere in the Nginx configuration. Potentially repeatable configuration segments are good candidates for refactoring into snippets.
## Server Logs
     - /var/log/nginx/access.log: Every request to your web server is recorded in this log file unless Nginx is configured to do otherwise.
     - /var/log/nginx/error.log: Any Nginx errors will be recorded in this log.
