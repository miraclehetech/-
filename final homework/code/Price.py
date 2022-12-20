# coding=gbk
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
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


class Price(object):
    def __init__(self):
        self.url = 'https://price.ccement.com/Price_list-1-s0-e0-p0-c0-k0-b0.html'
        service = Service(executable_path=r'.\chromedriver.exe')
        self.driver = webdriver.Chrome(service=service)
        # self.driver = webdriver.Chrome(executable_path=r'.\chromedriver.exe')
        self.driver.get(self.url)
        self.can = 11
        self.data = pd.DataFrame()
        logging.basicConfig(filename='log.txt',
                            level=logging.INFO,
                            format="%(asctime)s %(levelname)s %(message)s",
                            datefmt="[%a %d %Y %H:%M:%S]"
                            )
        # �޸�Ϊ�Լ���
        mydb = mysql.connector.connect(
          host="localhost",
          user="root",
          passwd="123456"
        )
        # schema_name
        db = 'price'
        self.mycursor = mydb.cursor()
        self.mycursor.execute("CREATE DATABASE IF NOT EXISTS "+db)
        self.engine = create_engine('mysql+pymysql://root:Ab123456@127.0.0.1:3306/' + db)

    def check_element(self, element, condition):
        try:
            self.driver.find_element(condition, element)
            return True
        # except Exception as e:
        except NoSuchElementException:
            return False

    # ����ĳ��ǩ�µ�li
    def get_list(self, box, ul, wait=0.3):
        input_ = self.driver.find_element(By.ID, box)  # ���������
        input_.click()
        # �ȴ�ֱ���б��������
        time.sleep(wait)
        ul_ = self.driver.find_element(By.CSS_SELECTOR, ul)
        lis = ul_.find_elements(By.TAG_NAME, 'li')
        return lis

    # ����url����ҳ���html
    def get_html(self, url):
        html = requests.get(url)
        html.encoding = "utf-8"
        return html.text

    # �ع�档����
    def close_adv(self):
        if self.check_element('//*[@id="KFLOGO"]/div[1]', By.XPATH):
            self.driver.find_element(By.XPATH, '//*[@id="KFLOGO"]/div[1]').click()
        # ��������ᱻǰ��Ĺ�浲ס����Ҫ�ع�档����
        try:
            # os.system('pause')
            # self.driver.find_element(By.CLASS_NAME, 'close').click()
            self.driver.find_element(By.XPATH, '/html/body/div[15]/div').click()
        except ElementNotInteractableException:
            pass

    # / html / body / div[15] / div
    # ��ҳ��ʱ����е����⣬��������ж�һ��
    def special(self):
        if self.check_element('//*[@id="KFLOGO"]/div[1]', By.XPATH):
            self.can = 11
        else:
            self.can = 7

    def data_process(self, data):
        self.data = data.copy()
        self.data.rename(columns={'��װ��(˵��)  ���ڳ��ҹ��Ʊ��ۻ�����ͳ�ƣ�Ϊ���ؼ���������������λ�ۣ������ӷѣ����൱�����ۼ۸�ˮƽ��': '��װ��'}, inplace=True)
        self.data = self.data.drop_duplicates()
        self.data.drop(self.data.columns[[3, 4, 6, 7, 9]], axis=1, inplace=True)
        # ɾ����װ��Ϊ������
        self.data = self.data[~self.data['��װ��'].isin(['��'])]

    # ��ȡ�۸���Ϣ��ÿ��һ������һ��ˮ�����Ϣ
    def pa(self, city):
        page = 1
        press = self.driver.find_element(By.CLASS_NAME, "btnsearch")
        # self.close_adv()
        press.click()  # ����ύ��ť

        # ��õ�һҳ������
        cur_url = self.driver.current_url
        html_txt = self.get_html(cur_url)
        soup = BeautifulSoup(html_txt, 'html.parser')

        table = soup.find(name='table')
        data = pd.read_html(str(table))[0]

        # �����һҳ����
        not_empty = len(self.driver.find_element(By.CSS_SELECTOR, 'div[class="paging_page clearfix"]').get_attribute('innerText'))
        # if (not data.empty) and self.check_element('next_page', By.CLASS_NAME):
        if not_empty:
            next_page = self.driver.find_element(By.CLASS_NAME, 'next_page')
            next_page_url = next_page.get_attribute('href')
            while next_page_url:
                # �����һҳ
                next_page.click()
                page += 1
                cur_url = self.driver.current_url
                html_txt = self.get_html(cur_url)
                soup = BeautifulSoup(html_txt, 'html.parser')

                table = soup.find(name='table')
                df = pd.read_html(str(table))[0]
                data = pd.concat([data, df], ignore_index=True)
                # ������һҳ��url
                next_page = self.driver.find_element(By.CLASS_NAME, 'next_page')
                next_page_url = next_page.get_attribute('href')
        self.data_process(data)
        table_name = city
        self.data.to_sql(name=table_name, con=self.engine, if_exists='append', index=False)
        return page

    def click_one(self, boxname, xpath, index):
        attempts = 0
        while attempts < 2:
            try:
                # ÿ�ε���������б�����һ��Ԫ��֮ǰ��Ҫ�ȵ��������Ԫ�أ��������б�����
                self.driver.find_element(By.ID, boxname).click()
                time.sleep(0.3)
                self.driver.implicitly_wait(10)
                xpath = xpath.format(self.can, index + 1)
                # print(xpath)
                instance = self.driver.find_element(By.XPATH, xpath)
                instance.click()
                return instance.get_attribute('name')
            except Exception:
                attempts += 1
        print('���쳣�������logging�޸�work��Ϣ')
        os.system('pause')
        return 'Failed'

    def display(self, info):
        pd.set_option('display.max_rows', None)
        print(self.data.shape)
        # if not self.data.empty:
        #     # print(self.data.head(self.data.shape[0]))
        #     print(self.data.head(2))
        # else:
        #     print('����Ϊ��' * 20, '\n')

    # �ӵ�istart��ˮ�࣬jstart�����У�kstart��Ʒ�ֿ�ʼ��
    def work(self, istart=0, jstart=0, kstart=0, length=5):
        self.special()
        for i in range(length):
            self.close_adv()
            f = True
            fortrade = self.click_one("fortrade", '/html/body/div[{}]/div[1]/div/div[1]/ul/li[{}]', i+istart)
            lis2 = self.get_list("city", 'div[data-field="province"]')
            if i:  # û�����ÿ�ζ��ӵ�jstart�����п�ʼ������������ﵽ������һ��ˮ��ʱ��ͷ��ʼ��
                jstart = 0
            for j in range(len(lis2)-jstart):
                city = self.click_one("city", '/html/body/div[{}]/div[1]/div/div[2]/ul/div[1]/li[{}]', j+jstart)
                lis3 = self.get_list("kind", 'ul[data-field="kind"]')
                if i or j:
                    kstart = 0
                for k in range(len(lis3)-kstart):
                    if not (i+istart == 2 and j+jstart == 2 and k+kstart == 0):  # ����������΢�ۡ��ӱ���s75ʱ�Ῠ������վ�����⣬���Ըɴ಻Ҫ��һ����¼
                        # self.special()
                        # print(i,j,k)
                        kind = self.click_one("kind", '/html/body/div[{}]/div[1]/div/div[3]/ul/li[{}]', k+kstart)
                        if not f:
                            self.close_adv()
                        page = self.pa(city)
                        f = False
                        info = 'ˮ������: {}|{}, ʡ��: {}|{}, Ʒ��: {}|{}, ҳ: {}'.format(i+istart, fortrade, j+jstart, city, k+kstart, kind, page)
                        print(info)
                        self.display(info)
                        logging.info(info)


if __name__ == '__main__':
    price = Price()
    # �������Ϳ��û�м۸���Ϣ��Ҫ����Ա���������������������
    # ��ȡˮ��
    price.work(istart=0, jstart=17, kstart=3, length=1)
    # ��ȡɰʯ���Ϻ�ɰ��
    # price.work(istart=3, jstart=0, kstart=0, length=2)

    # price.get_pages()
    os.system('pause')
    # todo:�洢����
    # todo:how to ���ݼ��ɣ�
    # todo:how to չʾ��
    # todo: ...
