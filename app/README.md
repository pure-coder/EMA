"Fitness App"

Can be viewed at https://www.jrdunkley.co.uk/

##

This project uses EditorConfig to standardise text editor configuration.
see http://editorconfig.org for more information

This application allows personal trainers to keep track of clients that they train. It allows the personal trainer 
 to have their client contact details in one place, as well as their progression data, workouts, and notes. Client's can 
 also log in to view their own data, such as their progression data and workouts. They can edit there contact details and 
 profile picture.

The following environment variables are used in this application, they will need to be set or changed in respect
to the set up you will be using.

SECRET_OR_KEY_RESOURCE=Your_secret_key_here
MONGO_DB_URI_RESOURCE=Your_mongodb_uri_address
AWS_S3_KEY=Your_aws_key_here
AWS_S3_SECRET=Your_secret_here
AWS_S3_REGION=Your_region_here
BUCKET=Your_bucket_variable_here

SECRET_OR_KEY_RESOURCE - Used with JWT (JSON Web Tokens)
MONGO_DB_URI_RESOURCE - This is the URI for the NoSQL database. In this application mongodb is used alongside the mongoose
                        framework. I'm currently running the production app on the free version of Mongodb Atlas.
                        
I'm running the production version as an instance on the free tier offered by AWS, I'm using an S3 bucket to hold the 
profile picture uploads (and will also use an S3 bucket for progression photos) if you choose to do the same you will 
need to provide the following environment variables so that the javascript SDK can communicate with the aws bucket.
                        
AWS_S3_KEY - This is the key given to you when setting up an S3 Bucket
AWS_S3_SECRET= This is the secret given to you when setting up an S3 Bucket
AWS_S3_REGION - This is the region that you chose to use when setting up an S3 Bucket
BUCKET - This is the unique name of the bucket that you created

The application uses the Express framework for the REST API. (MIT License)
The application also uses the react library for the user interface. (MIT License)
The scheduler part of the application uses the DHTMLX Scheduler framework. (GNU GPL License)
The progression charts in the application use the D3.js library. (BSD License)

To Install the application, clone the project to your server. You will then need to install the Express application server from the app directory
using "npm install". After that has successfully completed you will need to install and build the react application, to do this you will need to 
run "npm install" from the client directory, and then "npm run build" (The build folder is needed when using it for production, for developing 
purposes it is not needed, the development version can be run from the app directory using npm run dev). Run "node server.js" from the app directory 
when using the application in production mode.
