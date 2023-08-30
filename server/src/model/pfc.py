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
    {protein},
    {fat},
    {carbohydrate},
    '{note}'
    );
  '''

  execute_query(query)