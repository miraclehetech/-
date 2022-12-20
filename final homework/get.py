import mysql.connector
import pandas as pd
from flask import Flask, render_template,jsonify
app = Flask(__name__)
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
average=dict()
for i in province:
    mycursor.execute("SELECT * FROM %s"%i)
    myresult=mycursor.fetchall()
    result.append(myresult)
    temp = pd.DataFrame(list(myresult),columns=['品牌','水泥品种','地区','价格','时间'])
    temp['价格']=temp['价格'].map(lambda x:x[0])
    temp['价格']=temp['价格'].map(lambda x:float(x))
    average[i]=temp['价格'].mean()
    temp1=pd.concat([temp,temp1])
province=[]
province=temp1['地区'].unique()
overall_information=pd.DataFrame()
price_avg=temp1.groupby('地区')['价格'].apply(lambda x:x.mean())
brand_num=temp1.groupby('地区')['品牌'].apply(lambda x:x.nunique())
cement_num=temp1.groupby('地区')['水泥品种'].apply(lambda x:x.nunique())
all_num=temp1['水泥品种'].nunique()
cement_num=cement_num/all_num
cement_num=cement_num.sort_values(ascending=False)
cement_cities=temp1.groupby('品牌')['地区'].apply(lambda x:x.nunique())
dynamic_price=temp1.groupby(['地区','时间'])['价格'].mean()
brand_num=temp1['水泥品种'].value_counts()
# print(cement_cities.sort_values(ascending=False))
print(dynamic_price.loc['上海市  市辖区'])#上海市市辖区的动态变化
print(type(dynamic_price.index))
print(dynamic_price.loc['上海市  市辖区'].index)
print(dynamic_price.loc['上海市  市辖区'].values)
# print(list(price_avg.index),list(price_avg.values))
price_avg=price_avg.sort_values(ascending=False)
temp1=brand_num.index.tolist()
temp2=brand_num.values.tolist()
res=[]
for name,value in zip(temp1,temp2):
    res.append({'name':name,'value':value})
print(res)
mydb2 = mysql.connector.connect(
          host="localhost",
          user="root",
          passwd="123456",
          database='price_index'
    )
mycursor2 = mydb2.cursor()
mycursor2.execute('show tables')
province2=[]
result2=[]
for i in mycursor2:
    for j in i:
        province2.append(j)
print(province2)
temp2=pd.DataFrame()
mycursor2.execute("SELECT * FROM `中原水泥p.o42.5价格指数`")
myresult2=mycursor2.fetchall()
result2.append(myresult2)
temp = pd.DataFrame(list(myresult2),columns=['时间','收价','上收','涨跌','开价','最高','最低']) 
temp2=pd.concat([temp,temp2])
number=temp2
columns=['开价','收价','最低','最高']

temp1=number['时间'].tolist()
temp2=number['开价'].tolist()
temp3=number['收价'].tolist()
temp4=number['最低'].tolist()
temp5=number['最高'].tolist()
result=[]
for i in range(len(temp1)):
    temp=[]
    temp.append(temp2[i])
    temp.append(temp3[i])
    temp.append(temp4[i])
    temp.append(temp5[i])
    result.append(temp)
print(result)
print(average)
@app.route("/")
def index():
    # 渲染模板的同时将数据传输进去
    return render_template("index.html")
@app.route('/echarts', methods=["GET"]) #echarts 名字可以改为任意，但一定要与HTML文件中一至
def echarts():
    temp1=brand_num.index.tolist()
    temp2=brand_num.values.tolist()
    return jsonify(categorys=temp1,value=temp2)
@app.route('/echarts1', methods=["GET"]) #echarts 名字可以改为任意，但一定要与HTML文件中一至
def echarts1():
    temp1=price_avg.index.tolist()
    temp2=price_avg.values.tolist()
    return jsonify(categorys=temp1,value=temp2)
@app.route('/echarts2', methods=["GET"]) #echarts 名字可以改为任意，但一定要与HTML文件中一至
def echarts2():
    temp1=dynamic_price.loc['上海市  市辖区'].index.tolist()
    temp2=dynamic_price.loc['上海市  市辖区'].values.tolist()
    return jsonify(categorys=temp1,value=temp2)
@app.route('/echarts3', methods=["GET"]) #echarts 名字可以改为任意，但一定要与HTML文件中一至
def echarts3():
    temp1=brand_num.index.tolist()
    temp2=brand_num.values.tolist()
    res=[]
    for name,value in zip(temp1,temp2):
        res.append({'name':name,'value':value})
    return jsonify(({'data':res}))
@app.route('/echarts4', methods=["GET"]) #echarts 名字可以改为任意，但一定要与HTML文件中一至
def echarts4():
    temp1=number['时间'].tolist()
    temp2=number['开价'].tolist()
    temp3=number['收价'].tolist()
    temp4=number['最低'].tolist()
    temp5=number['最高'].tolist()
    result=[]
    for i in range(len(temp1)):
        temp=[]
        temp.append(temp2[i])
        temp.append(temp3[i])
        temp.append(temp4[i])
        temp.append(temp5[i])
        result.append(temp)
    return jsonify(time=temp1,lastvalue=result)

       
if __name__ == '__main__':
        app.run(debug=True)
