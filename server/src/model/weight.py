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

def insert(year, month, date, time, weight, body_fat_percentage):
  date_str = f'{year}-{month}-{date}'
  input_date = datetime.strptime(date_str, '%Y-%m-%d')

  query = f'''
    insert into WEIGHT
    values (
    '{input_date}',
    {time},
    {weight},
    {body_fat_percentage}
    );
  '''

  execute_query(query)

def inquiry():
  query = f'''
    SELECT
      DATE_FORMAT(w.date, '%Y-%m-%d') date,
      w.weight,
      AVG(w2.weight) AS weight_avg,
      w.bodyFatPercentage,
      AVG(w2.bodyFatPercentage) AS BFP_avg,
      u.weight_goal,
      u.BFP_goal,
      C.calorie,
      C.protein,
      C.fat,
      C.carbohydrate
    FROM
      USER u,
      WEIGHT w
    LEFT JOIN
      WEIGHT w2 ON w.date >= w2.date AND w.date - INTERVAL 2 WEEK <= w2.date
    LEFT JOIN (
        SELECT
            DATE(date) AS date,
            SUM(calorie) AS calorie,
            SUM(protein) AS protein,
            SUM(fat) AS fat,
            SUM(carbohydrate) AS carbohydrate
        FROM
            SIMPLE_TRACKER.CALORIE
        GROUP BY
            DATE(date)
    ) C ON w.date = C.date
    GROUP BY
      w.date, w.weight, u.weight_goal, u.BFP_goal, C.calorie, C.protein, C.fat, C.carbohydrate
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
      label_tuple = ('date', 'weight', 'weight_average', 'bodyFatPercentage', 'BFP_average', 'weight_goal', 'BFP_goal', 'calorie', 'protein', 'fat', 'carbohydrate')
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

def check(year, month, date):
  query = f'''
    SELECT
      count(*)
    FROM
      WEIGHT
    WHERE
      date = '{year}-{month}-{date}';
  '''

  isExist = False

  try:
    conn = db.get_conn()            # DBに接続
    cursor = conn.cursor()          # カーソルを取得
    cursor.execute(query)           # SQL実行
    data_count = cursor.fetchall()     # selectの結果を全件タプルに格納

    if data_count[0][0] > 0:
      isExist = True

  except mysql.connector.errors.ProgrammingError as e:
    print('エラーが発生しました')
    print(e)
  finally:
    if conn != None:
      cursor.close()              # カーソルを終了
      conn.close()                # DB切断

  return { 'result' : isExist }

def update(year, month, date, time, weight, body_fat_percentage):
  query = f'''
    UPDATE
      WEIGHT
    SET
      TIME = {time},
      WEIGHT = {weight},
      BODYFATPERCENTAGE = {body_fat_percentage}
    WHERE
      date = '{year}-{month}-{date}';
  '''

  execute_query(query)

def todays():
  query = f'''
    select weight from WEIGHT order by date desc limit 1;
  '''

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

  return rows[0][0]