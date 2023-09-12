import mysql.connector
import src.model.utils.db_access as db
from datetime import datetime

def execute_query(query):
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

def insert(year, month, date, hour, minute, calorie, protein, fat, carbohydrate, note):
  date_str = f'{year}-{month}-{date} {hour}:{minute}'
  input_date = datetime.strptime(date_str, '%Y-%m-%d %H:%M')

  # 現在の最大idを取得
  max_id_query = "SELECT MAX(id) FROM CALORIE"
  conn = db.get_conn()
  cursor = conn.cursor()
  cursor.execute(max_id_query)
  max_id = cursor.fetchone()[0]
  cursor.close()
  conn.close()

  if max_id is None:
      max_id = 0
  new_id = max_id + 1
  
  query = f'''
    insert into CALORIE
    values (
    '{input_date}',
    {new_id},
    {calorie},
    {protein if protein != '' else 'null'},
    {fat if fat != '' else 'null'},
    {carbohydrate if carbohydrate != '' else 'null'},
    '{note}'
    );
  '''

  execute_query(query)

def update(id, calorie, protein, fat, carbohydrate, note):

  query = f'''
    update CALORIE
    set 
    calorie = {calorie},
    protein = {protein if protein != '' else 'null'},
    fat = {fat if fat != '' else 'null'},
    carbohydrate = {carbohydrate if carbohydrate != '' else 'null'},
    note = '{note}'
    where id = {id};
  '''

  execute_query(query)

def select_todays_data():
  query = f'''
    SELECT
      id,
      calorie,
      protein,
      fat,
      carbohydrate,
      note
    FROM
      CALORIE
    WHERE
      DATE_FORMAT(date, '%Y-%m-%d') = DATE_FORMAT(NOW(), '%Y-%m-%d')
    ORDER BY
      id;
  '''

  results = []

  try:
    conn = db.get_conn()            # DBに接続
    cursor = conn.cursor()          # カーソルを取得
    cursor.execute(query)           # SQL実行
    weights = cursor.fetchall()     # selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in weights:
      label_tuple = ('id', 'calorie', 'protein', 'fat', 'carbohydrate', 'note')
      row_dict = {label: data for data, label in zip(data_tuple, label_tuple)} 
      results.append(row_dict)

  except mysql.connector.errors.ProgrammingError as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

  return results