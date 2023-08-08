import mysql.connector
import json
import src.model.utils.db_access as db

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

def insert(year, month, date, weight):
  query = f'''
    insert into weight
    values (
    {year},
    {month},
    {date},
    {weight}
    );
  '''

  execute_query(query)