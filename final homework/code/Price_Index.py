# coding=gbk
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import *
import time
import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
from sqlalchemy import create_engine
import mysql.connector
import logging
os.environ['NUMEXPR_MAX_THREADS'] = '16'


class PriceIndex(object):
    def __init__(self):
        self.url = 'https://index.ccement.com/all.html'
        # self.url = 'https://index.ccement.com/hb.html'
        service = Service(executable_path=r'.\chromedriver.exe')
        self.driver = webdriver.Chrome(service=service)
        self.driver.get(self.url)
        self.data = pd.DataFrame(columns=['ʱ��', '�ռ�', '����', '�ǵ�', '����', '���', '���'])
        # logging.basicConfig(filename='log.txt',
        #                     level=logging.INFO,
        #                     format="%(asctime)s %(levelname)s %(message)s",
        #                     datefmt="[%a %d %Y %H:%M:%S]"
        #                     )
        # �޸�Ϊ�Լ���
        mydb = mysql.connector.connect(
          host="localhost",
          user="root",
          passwd="123456"
        )
        self.table_name = None
        # schema_name
        db = 'price_index'
        self.mycursor = mydb.cursor()
        self.mycursor.execute("CREATE DATABASE IF NOT EXISTS "+db)
        self.engine = create_engine('mysql+pymysql://root:Ab123456@127.0.0.1:3306/' + db)

    def display(self):
        print(self.table_name)
        print(self.data)
        print()

    # ������ת��Ϊdataframe
    def to_data(self, tspans):
        row = []
        for i, tspan in enumerate(tspans):
            content = tspan.get_attribute("innerHTML")
            index = content.find(':') + 1
            content = content[index:].strip(' ')
            if i != 1 and i != 2:
                row.append(content)
            if i == 2:
                self.table_name = content.lower()
        tmp = pd.DataFrame([row], columns=['ʱ��', '�ռ�', '����', '�ǵ�', '����', '���', '���'])
        self.data = pd.concat([self.data, tmp], ignore_index=True)

    def pa(self):
        ul_ = self.driver.find_element(By.CLASS_NAME, 'highcharts-series-group')
        paths = ul_.find_elements(By.TAG_NAME, 'path')
        for i, path in enumerate(paths):
            while True:
                # �������������path��
                ActionChains(self.driver).move_to_element(path).perform()
                g = self.driver.find_element(By.CLASS_NAME, 'highcharts-root')
                text = g.find_elements(By.TAG_NAME, 'g')[-1].find_element(By.TAG_NAME, 'text')
                tspans = text.find_elements(By.TAG_NAME, 'tspan')
                if len(tspans) != 1:
                    break
            self.to_data(tspans)

    def work(self, no=0):
        ul_ = self.driver.find_element(By.CLASS_NAME, 'swiper-wrapper')
        lis = ul_.find_elements(By.TAG_NAME, 'li')
        length = len(lis)
        for i in range(length-no):
            # ����ˮ��ú�۲�ָ��
            if i+no == 1:
                continue
            ul_ = self.driver.find_element(By.CLASS_NAME, 'swiper-wrapper')
            li = ul_.find_elements(By.TAG_NAME, 'li')[i+no]
            a = li.find_element(By.TAG_NAME, 'a')
            a.click()
            self.pa()
            self.data.to_sql(name=self.table_name, con=self.engine, if_exists='append', index=False)
            self.display()
            self.data = pd.DataFrame(columns=['ʱ��', '�ռ�', '����', '�ǵ�', '����', '���', '���'])


if __name__ == '__main__':
    index = PriceIndex()
    # ��no=0��ȫ��ˮ��ָ����ʼ��
    index.work(no=9)
    # os.system('pause')

