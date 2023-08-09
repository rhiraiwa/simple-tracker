import mysql.connector
import json
import src.model.utils.db_access as db
from datetime import datetime, timedelta

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

def insert(year, month, date, time, weight):

  date_str = f'{year}-{month}-{date}'

  input_date = datetime.strptime(date_str, '%Y-%m-%d')
  two_weeks_ago = input_date - timedelta(weeks=2)

  query4weight = f'''
    insert into weight
    values (
    '{input_date}',
    {time},
    {weight}
    );
  '''

  query4average = f'''
    insert into average
    values (
    '{input_date}',
    (
      SELECT CASE
      WHEN count(*) = 0 THEN sum(weight)
      ELSE sum(weight)/count(*) END as average
      FROM weight
      WHERE date BETWEEN '{two_weeks_ago}' AND '{input_date}'
    )
    );
  '''

  execute_query(query4weight)
  execute_query(query4average)