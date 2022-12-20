import mysql.connector
import pandas as pd
mydb = mysql.connector.connect(
          host="localhost",
          user="root",
          passwd="123456",
          database='price'
    )
mycursor = mydb.cursor()
mycursor.execute('show tables')
province=[]
result=[]
for i in mycursor:
    for j in i:
        province.append(j)
temp1=pd.DataFrame()
for i in province:
    mycursor.execute("SELECT * FROM %s"%i)
    myresult=mycursor.fetchall()
    result.append(myresult)
    temp = pd.DataFrame(list(myresult),columns=['品牌','水泥品种','地区','价格','时间']) 
    temp1=pd.concat([temp,temp1])
temp1['价格']=temp1['价格'].map(lambda x:x[0])
province=[]
province=temp1['地区'].unique()
overall_information=pd.DataFrame()
temp1['价格']=temp1['价格'].map(lambda x:float(x))
price_avg=temp1.groupby('地区')['价格'].apply(lambda x:x.mean())
brand_num=temp1.groupby('地区')['品牌'].apply(lambda x:x.nunique())
cement_num=temp1.groupby('地区')['水泥品种'].apply(lambda x:x.nunique())
cement_cities=temp1.groupby('品牌')['地区'].apply(lambda x:x.nunique())
dynamic_price=temp1.groupby(['地区','时间'])['价格'].mean()
print(cement_cities.sort_values(ascending=False))
# print(type(dynamic_price.loc['上海市  市辖区']))#上海市市辖区的动态变化

