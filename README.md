# Encrypted key-value store 

## Endpoints

Here are common endpoints provided by the service
 - `/` - prints a service name
 - `/version` - prints a service version
 - `/ping` - health endpoint

And here are service related endpoints:
 - `GET /store/:id` - get stored value based on provided `:id`
    - Id has to be a string and can contain a wildcard character `*` (example: `key-*`)
    - While sending a GET request, there has to be provided also `encryption-key`.
 
 - `POST /store/:id` - save value identified by `:id`
    - Id has to be a string.
    - While sending a POST request, there has to be provided also `encryption-key` header.
    - POST request expects a JSON body which will be stored as an encrypted value in the store.
 
## How to run in a test mode
```bash
# run test database with encryption service
docker-compose -f docker-compose.test.yaml up -d

# list running services
docker-compose -f docker-compose.test.yaml ps

# stop services
docker-compose -f docker-compose.test.yaml stop
```

## How to run in a production mode
Set up mandatory environment variables:
 - `DATABASE_HOST` - PostgreSQL database address
 - `DATABASE_PASSWORD` - PostgreSQL database password
 - `DATABASE_NAME` - PostgreSQL database name

And run service inside of a docker container:
```bash
# run service on port 3000
docker-compose up -d
```



