# Matchya

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
