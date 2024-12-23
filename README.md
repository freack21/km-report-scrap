# Kampus Merdeka Report Activities Scraper

This project is a scraper to fetch activity report data from Kampus Merdeka. The application uses Node.js, Express, and Axios to fetch data from the Kampus Merdeka API and save it in a JSON file.

## Features

- Fetch activity report status from the Kampus Merdeka API
- Save report data into a `data.json` file
- Change configuration ID and cookie through an API endpoint
- Provide an endpoint to manually trigger data fetching

## Installation

Follow these steps to install and run this project on your device:

1. Clone this repository:

   ```sh
   git clone https://github.com/freack21/km-report-scrap.git
   cd km-report-scrap
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Copy the [config.example.json](https://github.com/freack21/km-report-scrap/blob/main/config.example.json) file to `config.json` and adjust the values:

   ```sh
   cp config.example.json config.json
   ```

4. Run the application:
   ```sh
   npm start
   ```

The application will run at `http://localhost:3000` (Port may vary based on `config.json`).

## API Endpoints

- `GET /` - Check service status
- `POST /set` - Change configuration ID and cookie
- `GET /exec` - Manually trigger data fetching

## Contribution

If you want to contribute to this project, please create a pull request or open an issue to discuss the changes you want to make.

## License

This project is licensed under the ISC license.
