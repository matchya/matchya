# DB

This folder contains scripts and resources for managing the database schema and data. We use Liquibase for database version control.

## Structure

- `changelog/`: This directory contains all the changesets for your database. Each changeset represents a change to the database schema.
- `config/`: This directory contains configuration files for your database.
- `scripts/`: This directory contains Python scripts to update and rollback database changes.

## Scripts

- `update.py`: This script applies any new changesets found in the `changelog/` directory to the database. You always need to pass the 'stage' parameter when running this script. Run this script whenever you want to update your database schema to the latest version.

```sh
python scripts/update.py --stage <stage>
```

- `rollback.py`: This script reverts changes made by the update.py script. You always need to pass the 'stage' parameter when running this script. You need to pass the count of the number of changesets you want to rollback.

```sh
python scripts/rollback.py --stage <stage> --count <number_of_changesets_to_rollback>
```

Replace <stage> with the stage of the deployment (e.g., 'dev', 'staging', 'production', etc.) and <number_of_changesets_to_rollback> with the number of changesets you want to rollback.

### Usage

When you want to make changes to the database schema, add a new changeset to the `changelog/` directory and then run the `update.py` script. If you need to revert any changes, use the `rollback.py` script.

Please ensure that you test your changes thoroughly in a development environment before applying them to the production database.

**Note**: It is not advised to pass 'staging' or 'production' as the 'stage' parameter when running the scripts locally, as these stages are covered in the CI pipeline. Always use a 'dev' when running the scripts locally.
