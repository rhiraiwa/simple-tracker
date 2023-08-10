import mysql.connector
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

  query4weight = f'''
    insert into weight
    values (
    '{input_date}',
    {time},
    {weight}
    );
  '''

  execute_query(query4weight)

def inquiry():

  query = f'''
    SELECT
      DATE_FORMAT(w.date, '%Y-%m-%d') date,
      w.weight,
      AVG(w2.weight) AS two_week_avg
    FROM
      WEIGHT w
    LEFT JOIN
      WEIGHT w2 ON w.date >= w2.date AND w.date - INTERVAL 2 WEEK <= w2.date
    GROUP BY
      w.date, w.weight
    ORDER BY
      w.date;
  '''

  results = []

  try:
    conn = db.get_conn()            # DBに接続
    cursor = conn.cursor()          # カーソルを取得
    cursor.execute(query)           # SQL実行
    weights = cursor.fetchall()     # selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in weights:
      label_tuple = ('date', 'weight', 'average')
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