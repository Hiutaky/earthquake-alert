# Earthquake Alert Bot

![Alt text](screenshot.png?raw=true "Telegram Message Example")


[English](#english) | [Italiano](#italiano)

## English

This repository contains a Telegram bot that monitors and reports earthquakes in Italy using data from the INGV (Istituto Nazionale di Geofisica e Vulcanologia).

### Features

- Fetches earthquake data from INGV every 10 minutes
- Filters new earthquakes and avoids duplicates
- Generates a map for each earthquake event
- Sends alerts to a Telegram channel with earthquake details and a map

### How it works

1. The bot fetches earthquake data from the INGV API
2. New earthquakes are filtered and processed
3. For each new earthquake, a map is generated using OpenStreetMap
4. An alert message is composed with earthquake details
5. The message and map are sent to a specified Telegram channel

### Setup

Bun is required to run .ts files on-the-fly, you can also setup tsc-node or similar.

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables:
   - `BOT_TOKEN`: Your Telegram bot token
   - `CHAT_ID`: The ID of the Telegram channel to send alerts to
4. Run the bot with `npm start`

### Main Components

- `src/index.ts`: Main entry point and earthquake fetching logic
- `src/api/ingv.ts`: INGV API interaction and data parsing
- `src/api/telegram.ts`: Telegram bot API interaction
- `src/utils/mapMaker.ts`: Map generation using OpenStreetMap tiles

## Italiano

Questo repository contiene un bot Telegram che monitora e segnala i terremoti in Italia utilizzando i dati dell'INGV (Istituto Nazionale di Geofisica e Vulcanologia).

### Caratteristiche

- Recupera i dati sui terremoti dall'INGV ogni 10 minuti
- Filtra i nuovi terremoti ed evita i duplicati
- Genera una mappa per ogni evento sismico
- Invia avvisi a un canale Telegram con i dettagli del terremoto e una mappa

### Come funziona

1. Il bot recupera i dati sui terremoti dall'API dell'INGV
2. I nuovi terremoti vengono filtrati ed elaborati
3. Per ogni nuovo terremoto, viene generata una mappa utilizzando OpenStreetMap
4. Viene composto un messaggio di avviso con i dettagli del terremoto
5. Il messaggio e la mappa vengono inviati a un canale Telegram specificato

### Configurazione

Bun è richiesto per eseguire i file .ts on-the-fly, puoi anche impostare tsc-node o simili.

1. Clona il repository
2. Installa le dipendenze con `npm install`
3. Configura le variabili d'ambiente:
   - `BOT_TOKEN`: Il token del tuo bot Telegram
   - `CHAT_ID`: L'ID del canale Telegram a cui inviare gli avvisi
4. Avvia il bot con `npm start`

### Componenti principali

- `src/index.ts`: Punto di ingresso principale e logica di recupero dei terremoti
- `src/api/ingv.ts`: Interazione con l'API INGV e parsing dei dati
- `src/api/telegram.ts`: Interazione con l'API del bot Telegram
- `src/utils/mapMaker.ts`: Generazione delle mappe utilizzando le tile di OpenStreetMap