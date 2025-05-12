# Gator-TS
Gator, a command line RSS aggregator!

## Features
- Add and manage RSS feeds from the command line
- Aggregate and display the latest articles
- User registration, login, and feed following
- Simple configuration and error handling

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/bzelaznicki/gator-ts.git
   cd gator-ts
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Build the project:
   ```sh
   npm run build
   ```


## Usage

Run the CLI tool with Node.js:
```sh
node dist/index.js <command> [options]
```
Or, if using ts-node (for development):
```sh
npx ts-node src/index.ts <command> [options]
```

### Example Commands
- Add a feed: `gator addfeed <feed-url>`
- Aggregate feeds: `gator agg`
- List feeds: `gator feeds`
- Register a user: `gator register <username>`
- Login: `gator login <username>`
- Follow a feed: `gator follow <feed-id>`
- Unfollow a feed: `gator unfollow <feed-id>`

## Config

Create a `.gatorconfig.json` file in your home directory with the following structure:

```json
{
  "db_url": "postgres://username:@localhost:5432/database?sslmode=disable"
}
```

Replace the values with your database connection string.

## Development
- Source code is in the `src/` directory
- Database schema and migrations are in `src/lib/db/`

## License
See [LICENSE](LICENSE) for details.

## Contributing
Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

## Acknowledgements
- Built with TypeScript and Node.js
- Uses Drizzle ORM for database management
