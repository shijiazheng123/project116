# import mysql.connector
import mysql.connector

db = mysql.connector.connect(
     #fill this out with your database info
     user="root",
     password="password",
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
     sql2 = "CREATE TABLE IF NOT EXISTS food (food_id TEXT, x DOUBLE, y DOUBLE)"
     cursor.execute(sql)
     cursor.execute(sql2)

def createPlayer(user):
     sql = "INSERT INTO players (username, score) VALUES(%s, %s)"
     data = (user, 0.0)
     cursor.execute(sql, data)

# Create food data
def createFood(foodid, x, y):
     sql = "INSERT INTO food (food_id, x, y) VALUES(%s, %s,%s)"
     data = (foodid, x, y)
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
def returnFood():
     sql = "SELECT * FROM food"
     cursor.execute(sql)
     data = cursor.fetchall()
     print(data)
#def updateHighest():
#    sql = "SELECT username,score FROM players"
#     cursor.execute(sql)
#     data = cursor.fetchall()
#     highScore = 0.0
#     sql2=""
#     for row in data:
#          #print(row[1])
#          if (row[1]>=highScore):
     #              highScore=row[1]
#               sql2 = "UPDATE players SET score='highScore' WHERE username='row[0]'"
#     cursor.execute(sql2)

setupTable()
createFood("12732", 2, 3)
createFood("127323", 4, 3)
returnFood()
#createPlayer("jcvfdks")
#playerExists("jcvfdksf")
#updateHighest()
#db.commit()
#db.close()