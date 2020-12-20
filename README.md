# AuthorsAPI
rest api built with typeorm,postgresql,express

# how to run?
 - docker-compose up -d
 - npm start 

 ***now server starts at localhost:3000 by default*** 
- now you can interact with `curl` or `postman` or your fav rest api testing tool.

 ## extras
 - to manually run a container 
    docker run -p 5432:5432 -d \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_DB=authorsapi \
        -v pgdata:/var/lib/postgresql/data \
        postgres

- to connect to container db through psql cli use `psql authorsapi -h localhost -U postgres`

- or jump into container direcly  `docker exec -it bdca2b8c09b7 psql -U postgres authorsapi`
