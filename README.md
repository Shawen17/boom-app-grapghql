# Boom-App-Graphql

This application is a mini demo of a loan service management application to manage client portfolios and perform action such as activating, blacklisting users, as well as approving and rejecting loan applications.

It is a microservice architecture with 
* Frontend - built with React
* Backend - built with Node.js(express.js)
* Mariadb - User authorization and authentication using jwt
* Mongodb - User portfolio
* Graphql - API 

Application was deployed using;
* Docker to build images and run container
* Prometheus to pull metrics from the services and set alerts
* Grafana as dashboard for the pulled metrics
* Docker-compose to deploy the containers to run on the same network

## How It Works

- On User Signup ----> Login page
- On Successful login 
- If user is admin/staff -----> AdminDashboard page
- if user is regular -------> User account page (where they can apply for new loan, check loan history, update profile)
- Admin can perform these operations;
* check all users
* add profile to users
* check user details
* check all loans and loan requests
* approve/reject loans
* activate/blacklist users
* get loans and users stats
* filter loans and users 
* advanced filter search to make user filtering specific.

It was fun testing the response time between REST and Grapghql API calls.