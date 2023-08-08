from src import app
from flask import json, request
from src.model import user

@app.route('/', methods=['GET'])
def index():
  return {'hello':'world'}

@app.route('/login', methods=['POST'])
def login():
  rd = json.loads(request.data)
  result = user.authenticate(rd['username'], rd['password'])

  return { 'result' : result }