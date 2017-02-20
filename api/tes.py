from celery import Celery

brokers = 'redis://127.0.0.1:6379/5'
backend = 'redis://127.0.0.1:6379/6'


app = Celery('tes', broker=brokers, backend=backend)

@app.tasks
def add(x, y):
    return x + y