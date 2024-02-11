FROM public.ecr.aws/lambda/python:3.9

WORKDIR ${LAMBDA_TASK_ROOT}

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY package.json package.json
COPY *.py .
COPY utils/ ./utils/

# actual command will be in serverless.yml
CMD [ "handler" ]
