import mysql.connector

#DB接続情報
def get_conn():
  conn = mysql.connector.connect(
    host = '127.0.0.1',      #localhostでもOK
    user = 'trainer',
    passwd = 'trainer00',
    db = 'SIMPLE_TRACKER'
  )
  return conn