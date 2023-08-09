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

def inquiry():
  query4weight = f'''
    select DATE_FORMAT(date, '%Y-%m-%d') date, weight from weight;
  '''

  query4average = f'''
    select DATE_FORMAT(date, '%Y-%m-%d') date, average from average;
  '''

  weight_results = []
  average_results = []

  try:
    conn = db.get_conn()            # DBに接続
    cursor = conn.cursor()          # カーソルを取得
    cursor.execute(query4weight)    # SQL実行
    weights = cursor.fetchall()     # selectの結果を全件タプルに格納
    cursor.execute(query4average)   # SQL実行
    averages = cursor.fetchall()    # selectの結果を全件タプルに格納

    ### ２つのリストを辞書へ変換
    for data_tuple in weights:
      label_tuple = ('date', 'weight')
      row_dict = {label: data for data, label in zip(data_tuple, label_tuple)} 
      weight_results.append(row_dict)

    ### ２つのリストを辞書へ変換
    for data_tuple in averages:
      label_tuple = ('date', 'weight')
      row_dict = {label: data for data, label in zip(data_tuple, label_tuple)} 
      average_results.append(row_dict)

  except mysql.connector.errors.ProgrammingError as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

  return {'weight': weight_results, 'average': average_results}