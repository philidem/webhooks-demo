# Webhooks Demo

## Prerequisites

### Install NodeJS
The WebHooks Service requires NodeJS to run locally and has been tested with version `0.12.0`. Later versions should work as well.

See http://nodejs.org/. Alternatively, use [Node Version Manager (NVM)](https://github.com/creationix/nvm).

### Install dependencies
```bash
cd path/to/webhooks-demo
npm install
```

### Install ngrok
WebHooks endpoints need to be publicly addressable so when running
your service locally, you need to create a tunnel through a publicly
addressable proxy. [ngrok](https://ngrok.com/) is a tool that makes this very easy.

Since the `webhooks-demo` server starts on port `8888` locally, start
`ngrok` with this command:
```bash
ngrok 8888
```

## Launch Webhooks Demo Server
```bash
node server.js
```

## Open Webhooks Presentation
```
http://localhost:8888/presentation/
```