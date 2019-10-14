# TBD API

## Run API in production mode

1. Copy `config/production.yaml.example` file, paste it in the same dir as `config/production.yaml` and change values inside accordingly. 
2. Run `docker-compose -f docker-compose.production.yaml up --detach`

## Start Development

1. `npm i`
2. Copy `config/default.yaml.example` file, paste it in the same dir as `config/default.yaml` and change values inside accordingly.
3. `docker-compose up --detach`
4. `npm run dev`