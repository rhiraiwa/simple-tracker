from src import app
from flask import json, request
from src.model import user, weight, pfc

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
  weight.insert(rd['year'], rd['month'], rd['date'], rd['time'], rd['weight'], rd['bodyFatPercentage'])

  return { 'insert' : 'done' }

@app.route('/update', methods=['POST'])
def update():
  rd = json.loads(request.data)
  weight.update(rd['year'], rd['month'], rd['date'], rd['time'], rd['weight'], rd['bodyFatPercentage'])

  return { 'update' : 'done' }

@app.route('/inquiry', methods=['POST'])
def inquiry():
  
  result = weight.inquiry()

  return { 'result' : result }

@app.route('/getGoal', methods=['POST'])
def get_goal():
  
  rd = json.loads(request.data)
  result = user.getGoal(rd['username'])

  return { 'result' : result }

@app.route('/setGoal', methods=['POST'])
def set_goal():
  
  rd = json.loads(request.data)
  result = user.setGoal(rd['username'], rd['goal'], rd['target'])

  return { 'result' : result }

@app.route('/pfcInput', methods=['POST'])
def pfc_input():
  
  rd = json.loads(request.data)
  result = pfc.insert(rd['year'], rd['month'], rd['date'], rd['hour'], rd['minute'], rd['calorie'], rd['protein'], rd['fat'], rd['carbohydrate'], rd['note'])

  return { 'result' : result }

@app.route('/todaysInfo', methods=['POST'])
def todays_info():
  
  result = pfc.select_todays_data()
  w = weight.todays()

  return { 'result' : result, 'weight' : w }

@app.route('/pfcUpdate', methods=['POST'])
def pfc_update():
  
  rd = json.loads(request.data)
  result = pfc.update(rd['id'], rd['calorie'], rd['protein'], rd['fat'], rd['carbohydrate'], rd['note'])

  return { 'result' : result }

@app.route('/pfcDelete', methods=['POST'])
def pfc_delete():
  rd = json.loads(request.data)
  print(rd['id'])
  result = pfc.delete(rd['id'])

  return { 'result' : result }

@app.route('/getUserInfo', methods=['POST'])
def get_userInfo():
  
  rd = json.loads(request.data)
  result = user.get_user_info(rd['username'])
  w = weight.todays()

  return { 'result' : result, 'weight' : w }

@app.route('/getCalorieList', methods=['POST'])
def get_calorie_list():
  
  result = pfc.select_all_data()

  return { 'result' : result }

@app.route('/userInfoUpdate', methods=['POST'])
def user_info_update():

  rd = json.loads(request.data)
  user.update_user_info(rd['username'], rd['gender'], rd['height'], rd['age'], rd['activityLevel'])

  return { 'result' : 'OK'}
  