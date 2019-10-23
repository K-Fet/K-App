# K-App Connector - KeziaII

Kezia II connector for the inventory management module of the K-App.

## Usage

When doing a `yarn`, the app will automatically install itself as a **Windows service**. You still
need to set correct environment variables inside a `.env`at the root of the project.

> You can copy the `.env.example` to `.env` and fill it.

> In order to work, the ODBC connection must be at system scope and not in userland.

You will need to have some environment variables set:
- `ODBC_CN`: ODBC Connection string to connect to KeziaII database (e.g.: `DSN=odbc_dsn;Uid=User;Pwd=Password;`)
- `K_APP_URL`: URL to the K-App (e.g.: `https://kfet-insa.fr`)
- `K_APP_USERNAME`: K-App username to the connector account
- `K_APP_PASSWORD`: K-App password to the connector account
- `ERROR_EMAIL`: Email to contact if there is a problem
- `SENDGRID_API_KEY`: Sendgrid API Key to send mail
- `MAX_TASK_FAILED`: Max time a task may fail in a row
- `PRODUCTS_MATCH_THRESHOLD`: Optional. Threshold for product matching
- `PULL_MINUTES_INTERVAL`: Optional. Interval to run tasks

### Connector Account

For now, you will need a special account with 2 permissions:
- `inventory-management:products:list` to match KeziaII products and K-App products
- `inventory-management:stock-events:add` to add events


## Roadmap

- Connect to the K-App through a token instead of an account
- Improve matching between KeziaII and K-App products
- Use an api endpoint from K-App as health check
