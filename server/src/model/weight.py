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

def insert(year, month, date, time, weight):

  query4weight = f'''
    insert into weight
    values (
    '{int(year):04d}-{int(month):02d}-{int(date):02d}',
    {time},
    {weight}
    );
  '''

  query4average = f'''
    insert into weight
    values (
    '{int(year):04d}-{int(month):02d}-{int(date):02d}',
    {weight}
    select sum(weight)/count(*) average from weight where date between '2023-08-01' and '2023-08-08';
    );
  '''

  execute_query(query4weight)