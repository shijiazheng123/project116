# import mysql.connector
import mysql.connector

db = mysql.connector.connect(
     #fill this out with your database info
     user="root",
     password="12345678",
     # url = "jdbc:mysql://localhost:3306",
     # username = "root",
     host='127.0.0.1',
     database="mysql",
     auth_plugin='mysql_native_password'
     # connection: Connection = DriverManager.getConnection(url, username, password)
)

##
cursor = db.cursor()
sql = ""

def setupTable():
     # cursor.execute("DROP TABLE IF EXISTS players")
     sql = "CREATE TABLE IF NOT EXISTS players (username TEXT, score DOUBLE)"
     cursor.execute(sql)

def createPlayer(user):
     sql = "INSERT INTO players (username, score) VALUES(%s, %s)"
     data = (user, 0.0)
     cursor.execute(sql, data)

def playerExists(user):
     sql = "SELECT username FROM players"
     cursor.execute(sql)
     data = cursor.fetchall()
     canCreate = True

     for row in data:
          if(row[0] == user):
               canCreate = False

     #print(canCreate)
     if canCreate:
          createPlayer(user)

setupTable()
#createPlayer("jcvfdks")
playerExists("jcvfdksf")
db.commit()
#db.close()