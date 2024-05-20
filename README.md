# Outdoor Advertise

## Description
- The OutdoorAdvertisement web application is designed to streamline and enhance the process of managing outdoor advertising. It provides a comprehensive platform for creating, managing, and analyzing advertisements, catering to different user roles including Users, Members, and Admins. This application aims to make outdoor advertising more efficient, transparent, and user-friendly.
- Users can book posters for their desired dates, with all necessary details included.
- Members can design, create, and manage their posters, with options to edit and delete them as needed. They can also analyze their income based on their posters, gaining valuable insights into their earnings.
- Admins handle the assignment and management of user roles, ensuring smooth operation and compliance. They review and approve posters created by members and maintain quality control.
- The admin dashboard provides comprehensive analytics, displaying yearly, monthly, and daily income, as well as the number of users and members.
- Automated email notifications are sent to poster owners, containing user and poster details for clear communication.

## Technologies Used
- Next.js
- Express.js
- Nest.js
- MongoDb
- Prometheus
- Grafana
- Metrics
- GoogleMaps

## Features
- User Authentication
- User Roles and Permissions
- Poster Creation and Management
- Income Analysis
- Admin Management
- User-Friendly Interface
- Secure HTTPS Connection
- Horizontal Pod Autoscaling
- Metrics Monitoring


## Installation
1. Clone the repository
```bash
https://github.com/VanshSutariya/Outdoor-Advertise.git
```

2. Navigate to server directory and install dependencies
```bash
cd server
npm install
```

3. Navigate to client directory and install dependencies
```bash
cd client
npm install
```

4. Modify the .env file in the server directory 
```bash
Mongodb_Cluster= 

// JWT
JWT_SECRET= 
JWT_EXPIRES=

//EMAIL
EMAIL_HOST=smtp.gmail.com 
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=

# // stripe 
STRIPE_SECRET_KEY= 
STRIPE_WEBHOOK_SECRET=

#  cloudinary 
CLOUD_NAME=\
CLOUDNERY_KEY=
CLOUDNERY_SECRET_KEY=
```

5. Modify the .env file in the client directory with the server URL
```bash

GMAPS_KEY= google maps api key
```

6. Start the server
```bash
cd server
npm run start:dev
```

7. Start the client
```bash
cd client
npm run dev
```

## Author
### Vansh Sutariya
- [LinkedIn](https://www.linkedin.com/in/vansh-sutariya/)
- [Twitter/X](https://x.com/vanshsutariya)
- [GitHub](https://github.com/VanshSutariya)

## License
This project is open source and available under the [MIT License](LICENSE).
