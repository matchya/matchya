FROM public.ecr.aws/lambda/python:3.9

# Set the working directory to Lambda task root (default is /var/task)
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy the requirements.txt file and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the necessary files and directories to the container
COPY *.py .
COPY utils/ ./utils/

# Set the CMD to your handler (this will be overwritten by Lambda)
CMD ["handler"]
