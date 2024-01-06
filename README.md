# Matchya

## How to Access Staging/Production Database

Accessing the staging or production database involves creating a secure connection to the database server. This is often done using a method called SSH tunneling.

### How to Create an SSH Tunnel?

We have a script in our project that simplifies this process. Here's how you can use it:

1. Open your terminal.

2. Navigate to the project's root directory.

3. Run the following command:

```sh
make create-ssh-tunnel environment=staging
```

### How to Access the Database (via Terminal)?

Once the SSH tunnel is set up, you can access the database using your preferred database client. Just use localhost as the host and the forwarded port (which the script will output) as the port.

Running the Database Access Command
In a separate terminal window, while the SSH tunnel is still running, you can execute the following command to access the secure database:

```sh
make access-secure-db environment=staging
```

Remember to close the SSH tunnel when you're done by pressing Ctrl+C in the terminal where the script is running.

Note: You can use db visual editors via configuration
