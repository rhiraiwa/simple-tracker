import mysql.connector
import json
import src.model.utils.db_access as db

def execute_query(query):
  try:
    conn = db.get_conn()            # DBに接続
    cursor = conn.cursor()          # カーソルを取得
    cursor.execute(query)           # SQL実行
    rows = cursor.fetchall()        # selectの結果を全件タプルに格納

  except mysql.connector.errors.ProgrammingError as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

  return rows

def select():
  query = '''
    select * from USER;
  '''

  result_row = []
  rows = execute_query(query)

  ### ２つのリストを辞書へ変換
  for data_tuple in rows:
    label_tuple = ('id', 'name', 'password')
    row_dict = {label: data for data, label in zip(data_tuple, label_tuple)} 
    result_row.append(row_dict)

  output_json = json.dumps(result_row, ensure_ascii=False)
  return output_json

def authenticate(name, password):
  query = f'''
    select count(*) from USER
    where name = '{name}'
    and password = '{password}';
  '''

  rows = execute_query(query)

  return True if rows[0][0] == 1 else False

def getGoal(name):
  query = f'''
    select weight_goal, BFP_goal from USER
    where name = '{name}';
  '''

  result_row = []
  rows = execute_query(query)

  ### ２つのリストを辞書へ変換
  for data_tuple in rows:
    label_tuple = ('weight_goal', 'BFP_goal')
    row_dict = {label: data for data, label in zip(data_tuple, label_tuple)} 
    result_row.append(row_dict)

  output_json = json.dumps(result_row, ensure_ascii=False)
  return output_json

def setGoal(name, goal, target):
  query = f'''
    UPDATE
      USER
    SET
      {target} = {goal}
    WHERE
      name = '{name}';
  '''

  try:
    conn = db.get_conn()            # DBに接続
    cursor = conn.cursor()          # カーソルを取得
    cursor.execute(query)           # SQL実行
    conn.commit()                   # コミット

  except mysql.connector.errors.ProgrammingError as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断