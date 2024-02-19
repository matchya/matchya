# Matchya

## PR Title Naming Convention

We follow semantic release versioning in our project. Therefore, it's important to specify the type, scope, and a brief description in the title of each pull request. Here are the types available:

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `perf`: A code change that improves performance
- `revert`: Reverts a previous commit
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests

### Scopes

The following are all the available scopes:

- `web`
- `authentication`
- `authorizer`
- `assessment`
- `candidate`
- `company`
- `interview`
- `ci`
- `terraform`
- `db`
- `lambdas`
- `script`
- `video`

The PR title should follow this format: `type(scope): description`

For example:

`feat(authentication): add login functionality`

By following this convention, we can ensure that our versioning is consistent and meaningful.

## Using Terraform

Our project uses Terraform for infrastructure management. We have two main folders for Terraform configurations:

- `shared`: This folder contains configurations for environment-agnostic infrastructure. To apply these configurations, you can simply run the following command in your terminal:

  ```sh
  terraform apply
  ```

- `environment`: This folder contains configurations for environment-specific resources. To apply these configurations, you need to select the appropriate Terraform workspace that corresponds to your environment. You can do this by running the following command in your terminal:

  ```
  terraform workspace select <environment>
  ```

  Replace <environment> with the name of your environment (e.g., dev, staging, production). For example, if you're working on your local machine and want to apply the configurations to the dev environment, you would run:

  ```
  terraform workspace select dev
  ```

  This command sets the Terraform workspace to dev, and any subsequent terraform apply commands will apply the configurations to the dev environment.

Remember to always check your current Terraform workspace before applying configurations to avoid updating resources in the wrong environment.

## How to Access Staging/Production Database

Accessing the staging or production database involves creating a secure connection to the database server. This is often done using a method called SSH tunneling.

Before you start, make sure you have set your AWS profile. You can do this by running the following command in your terminal:

```sh
export AWS_PROFILE=your-profile-name
```

### How to Create an SSH Tunnel

We have a script in our project that simplifies this process. Here's how you can use it:

1. Open your terminal.

2. Navigate to the project's root directory.

3. Run the following command:

```sh
make create-ssh-tunnel environment=staging
```

This command will start an SSH tunnel in the background

### How to Access the Database

Once the SSH tunnel is established, you can access the database in two ways:

1. **Using the Terminal:**
   Execute the following command to access the secure database:

   ```sh
   make access-secure-db environment=staging
   ```

2. **Using a Database Client:**
   You can also use your preferred database client (such as DBeaver, Visual Studio Code Plugin, etc.) to access the database. Ensure the SSH tunnel remains active during this process. Configure your client with the following settings:

   ```
    Host: localhost
    Username: Retrieve manually from SSM (/terraform/staging/rds/db_username)
    Password: Retrieve manually from SSM (/terraform/staging/rds/db_password)
    Port: 5433
    Remember to terminate the SSH tunnel once you're finished by pressing Ctrl+C in the terminal where the SSH tunnel is running.
   ```

### Close the SSH Tunnnel

When you're finished with the database, you should close the SSH tunnel. Here's how you can do it:

1. Open your terminal.

2. Navigate to the project's root directory.

3. Run the following command:

```
make close-ssh-tunnel
```

This command will stop the SSH tunnel that's running in the background.

## Python Linting

To ensure consistent code style and catch potential errors, we use linting with the help of the `autopep8` library. To set up linting and formatting on save in Visual Studio Code, install the `ms-python.python` extension in Visual Studio Code. This extension provides Python language support and integrates with various Python tools.

Once the installation is done, you're all good! We currently have the formatter configuration under `.vscode/settings.json`. The linting will happen on save.
