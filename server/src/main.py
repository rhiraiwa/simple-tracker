from src import app

@app.route('/', methods=['GET'])
def index():
  return {'hello':'world'}