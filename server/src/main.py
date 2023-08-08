from src import app
from flask import json, request
from src.model import user, weight

@app.route('/', methods=['GET'])
def index():
  return {'hello':'world'}

@app.route('/login', methods=['POST'])
def login():
  rd = json.loads(request.data)
  result = user.authenticate(rd['username'], rd['password'])

  return { 'result' : result }

@app.route('/input', methods=['POST'])
def input():
  rd = json.loads(request.data)
  weight.insert(rd['year'], rd['month'], rd['date'], rd['weight'])

  return { 'result' : 'weight' }