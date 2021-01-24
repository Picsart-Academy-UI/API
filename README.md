# API

## First Launch
 Create a `.env` file and add the following variables in it
  <pre>
    API_VERSION=/api/v1
    PORT=[[Your port]]
    MONGO_URI=[[Your local MongoDB URI]]
    SMTP_HOST=smtp.mail.ru
    SMTP_PORT=465
    MAIL_USER=[[Your mail, from where you'll send the invitation emails]]
    MAIL_PASSWORD=[[That mail password]]
    JWT_SECRET=[[Whatever you want]]
    PUBLIC_VAPID_KEY=[[Your generated public vapid key]]
    PRIVATE_VAPID_KEY=[[Your generated private vapid key]]
    WEBPUSH_MAILTO=[[Whatever email you want]]
    REDIS_HOST=[[Your Redis DB host]]
    REDIS_PORT=[[Your Redis DB port]]
  </pre>
  
## Run tests
`npm run test` - will run all the tests
<br>
`npm run test:only file=beginning of the test file name"` - will run specific test 

### Generate Vapid Keys
Before first server start, run the following command to get the public and private vapid keys from **web-push** package:<br/>
`./node_modules/.bin/web-push generate-vapid-keys`<br/>
It will give you the public and private vapid keys in terminal. Copy them and set into your `.env` file.


## Documentation

You can find the documentation by following this [link](https://documenter.getpostman.com/view/3321357/TVmV4Yzz#b0357e6d-3561-4a70-94e8-8dc5ca0e3816)



