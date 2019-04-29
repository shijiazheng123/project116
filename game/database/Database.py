#import mysql.connector
import mysql

db = mysql.connect(
     url = "jdbc:mysql://localhost:3306",
     username = "root",
     password = "",
    # connection: Connection = DriverManager.getConnection(url, username, password)
)

##

print(db)