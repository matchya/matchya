#!/bin/bash

# This script is used to close the SSH tunnel to the bastion host and RDS instance.

# Find the process ID (PID) of the process that's using local port 5433
pid=$(lsof -ti tcp:5433)

# If a process is using local port 5433, kill that process
if [ -n "$pid" ]; then
    kill $pid
    echo "SSH tunnel closed"
else
    echo "No SSH tunnel to close"
fi
