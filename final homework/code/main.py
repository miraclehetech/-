# coding=gbk
from Price import Price
from Price_Index import PriceIndex
import os


if __name__ == '__main__':
    # price = Price()
    # price.work(istart=0, jstart=17, kstart=3, length=1)

    os.system('pause')

    index = PriceIndex()
    # 从no=0即全国水泥指数开始爬
    index.work(no=9)
    # os.system('pause')
