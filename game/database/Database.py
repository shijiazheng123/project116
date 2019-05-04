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
     #print(data)
     return data

def removePoisonFood(foodid):
     sql2 = "DELETE FROM food WHERE food_id = %s"
     cursor.execute(sql2, (foodid,))

def update(username, score):
     sql = "UPDATE players SET score=%s WHERE username=%s"
     cursor.execute(sql, (username,score))

def getHighestScore():
    sql = "SELECT username, score FROM players WHERE score = (SELECT MAX(score) FROM players)"
    cursor.execute(sql)
    data = cursor.fetchall()
    playerdict = {"username" : data[0][0], "score" : data[0][1]}
    playerdict
    print(playerdict)

def removePlayer(user):
    sql = "DELETE FROM players WHERE username = %s"
    cursor.execute(sql, (user,))

setupTable()
createFood("12732", 2, 3)
createFood("127323", 4, 3)
returnFood()
#createPlayer("jcvfdks")
#playerExists("jcvfdksf")
#updateHighest()
#db.commit()
#db.close()