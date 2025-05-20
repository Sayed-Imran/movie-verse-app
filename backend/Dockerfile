FROM python:3.12-slim

WORKDIR /app

COPY req.txt .

RUN pip install --no-cache-dir -r req.txt && rm req.txt

COPY app/ .

EXPOSE 8000

CMD ["python", "main.py"]