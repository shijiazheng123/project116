# import mysql.connector
import mysql.connector

db = mysql.connector.connect(
     #fill this out with your database info
     user="root",
     password="",
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
     sql = "CREATE TABLE IF NOT EXISTS players (username TEXT, score INT)"
     sql2 = "CREATE TABLE IF NOT EXISTS food (food_id TEXT, x DOUBLE, y DOUBLE)"
     cursor.execute(sql)
     cursor.execute(sql2)
     db.commit()

def createPlayer(user):
     sql = "INSERT INTO players (username, score) VALUES(%s, %s)"
     data = (user, 0.0)
     cursor.execute(sql, data)
     db.commit()

# Create food data
def createFood(foodid, x, y):
     sql = "INSERT INTO food (food_id, x, y) VALUES(%s, %s,%s)"
     data = (foodid, x, y)
     cursor.execute(sql, data)
     db.commit()

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
     db.commit()

# Return food table
def returnFood():
     sql = "SELECT * FROM food"
     cursor.execute(sql)
     data = cursor.fetchall()
     print(data)
     db.commit()
     return data

# Return player table for testing
def returnPlayers():
     sql = "SELECT * FROM players"
     cursor.execute(sql)
     data = cursor.fetchall()
     #print(data)
     db.commit()
     return data

def removePoisonFood(foodid):
     sql2 = "DELETE FROM food WHERE food_id = %s"
     cursor.execute(sql2, (foodid,))
     db.commit()

def update(username, score):
     sql = "UPDATE players SET score=%s WHERE username=%s"
     cursor.execute(sql, (username,score))
     db.commit()

def getHighestScore():
    sql = "SELECT username, score FROM players WHERE score = (SELECT MAX(score) FROM players)"
    cursor.execute(sql)
    data = cursor.fetchall()
    playerdict = {"username": data[0][0], "score": data[0][1]}
    print(playerdict)
    db.commit()
    return playerdict

def removePlayer(user):
    sql = "DELETE FROM players WHERE username = %s"
    cursor.execute(sql, (user,))
    db.commit()

setupTable()

# createFood("12732", 2, 3)
# createFood("127323", 4, 3)
returnFood()
removePlayer("jcvfdks")
removePlayer("casey")
removePlayer("jcvfdks")
removePlayer('jcvfdksf')
print(returnPlayers())
db.commit()

#createPlayer("jcvfdks")
#playerExists("jcvfdksf")
#updateHighest()
#db.commit()
#db.close()