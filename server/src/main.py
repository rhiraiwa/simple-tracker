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

@app.route('/check', methods=['POST'])
def check():
  rd = json.loads(request.data)
  bool = weight.check(rd['year'], rd['month'], rd['date'])

  return bool

@app.route('/input', methods=['POST'])
def input():
  rd = json.loads(request.data)
  weight.insert(rd['year'], rd['month'], rd['date'], rd['time'], rd['weight'])

  return { 'insert' : 'done' }

@app.route('/update', methods=['POST'])
def update():
  rd = json.loads(request.data)
  weight.update(rd['year'], rd['month'], rd['date'], rd['time'], rd['weight'])

  return { 'update' : 'done' }

@app.route('/inquiry', methods=['POST'])
def inquiry():
  
  result = weight.inquiry()

  return { 'result' : result }