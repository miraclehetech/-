// 立即执行函数，防止变量污染 (function() {})();

// 柱状图模块1
(function () {
  // 1.实例化对象
  var myChart = echarts.init(document.querySelector(".bar .chart"));
  // 2.指定配置项和数据
  var option = {
    color: ['#2f89cf'],
    // 提示框组件
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    // 修改图表位置大小
    grid: {
      left: '0%',
      top: '10px',
      right: '0%',
      bottom: '4%',
      containLabel: true
    },
    // x轴相关配置
    xAxis: [{
      type: 'category',
      data: [],
      axisTick: {
        alignWithLabel: true
      },
      // 修改刻度标签，相关样式
      axisLabel: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 10
      },
      // x轴样式不显示
      axisLine: {
        show: false
      }
    }],
    // y轴相关配置
    yAxis: [{
      type: 'value',
      // 修改刻度标签，相关样式
      axisLabel: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 12
      },
      // y轴样式修改
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.6)",
          width: 2
        }
      },
      // y轴分割线的颜色
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.1)"
        }
      }
    }],
    // 系列列表配置
    series: [{
      name: '直接访问',
      type: 'bar',
      barWidth: '35%',
      // ajax传动态数据
      data: [],
    }
    ]
  }
  $.get('/echarts1').done(function (data) {
    console.log(data.categorys.slice(0, 5))
    console.log(data.value.slice(0, 5))
    // 填入数据
    myChart.setOption({
      xAxis: {
        data: data.categorys.slice(0, 3)            //flask传递过来的数据categories
      },
      series: [{
        // 根据名字对应到相应的系列
        data: data.value.slice(0, 3)  //flask传递过来的数据data
      }]
    });
  });


  // 3.把配置项给实例对象
  myChart.setOption(option);

  // 4.让图表随屏幕自适应
  window.addEventListener('resize', function () {
    myChart.resize();
  })
})();
// 柱状图模块2
(function () {
  // 1.实例化对象
  var myChart = echarts.init(document.querySelector(".bar2 .chart"));

  // 声明颜色数组
  var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
  // 2.指定配置项和数据
  var option = {
    tooltip:
    {
      trigger: 'item',
      formatter: function (params) {
        return params['data']
      }
    },
    grid: {
      top: "15%",
      left: '30%',
      bottom: '10%',
      // containLabel: true
    },
    xAxis: {
      // 不显示x轴相关信息
      show: false
    },
    yAxis: [{
      type: 'category',
      // y轴数据反转，与数组的顺序一致
      inverse: true,
      // 不显示y轴线和刻度
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      // 将刻度标签文字设置为白色
      axisLabel: {
        color: "#fff",
        fontSize: 10
      },
      data: []
    }, {
      // y轴数据反转，与数组的顺序一致
      inverse: true,
      show: true,
      // 不显示y轴线和刻度
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 10
      },
      data: []
    }],
    series: [{
      // 第一组柱子（条状）
      name: '条',
      type: 'bar',
      // 柱子之间的距离
      barCategoryGap: 50,
      // 柱子的宽度
      barWidth: 10,
      // 层级 相当于z-index
      yAxisIndex: 0,
      // 柱子更改样式
      itemStyle: {
        barBorderRadius: 20,
        // 此时的color可以修改柱子的颜色
        color: function (params) {
          // params 传进来的是柱子的对象
          // dataIndex 是当前柱子的索引号
          // console.log(params);
          return myColor[params.dataIndex];
        }
      },
      data: [],
      // 显示柱子内的百分比文字
    },
    {
      // 第二组柱子（框状 border）
      name: '框',
      type: 'bar',
      // 柱子之间的距离
      barCategoryGap: 50,
      // 柱子的宽度
      barWidth: 14,
      // 层级 相当于z-index
      yAxisIndex: 1,
      // 柱子修改样式
      itemStyle: {
        color: "none",
        borderColor: "#00c1de",
        borderWidth: 2,
        barBorderRadius: 15,
      },
      data: []
    }
    ]
  };
  $.get('/echarts1').done(function (data) {
    console.log(data.categorys.slice(0, 5))
    console.log(data.value.slice(0, 5))
    // 填入数据
    myChart.setOption({
      yAxis: {
        data: data.categorys.slice(0, 3)            //flask传递过来的数据categories
      },
      series: [
        {

          data: data.value.slice(0, 3)
        },
        {
          data: [20, 20, 20]
        }
      ]
    }
    )
  })
  // 3.把配置项给实例对象
  myChart.setOption(option);

  // 4.让图表随屏幕自适应
  window.addEventListener('resize', function () {
    myChart.resize();
  })
})();

// 折线图模块1
(function () {


  var myChart = echarts.init(document.querySelector(".line .chart"));

  var option = {
    // 修改两条线的颜色
    color: ['#00f2f1', '#ed3f35'],
    tooltip: {
      trigger: 'axis'
    },
    // 图例组件
    legend: {
      // 当serise 有name值时， legend 不需要写data
      // 修改图例组件文字颜色
      textStyle: {
        color: '#4c9bfd'
      },
      right: '10%',
    },
    grid: {
      top: "20%",
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      show: true, // 显示边框
      borderColor: '#012f4a' // 边框颜色
    },
    xAxis: {
      type: 'category',
      boundaryGap: false, // 去除轴间距
      data: [],
      // 去除刻度线
      axisTick: {
        show: false
      },
      axisLabel: {
        color: "#4c9bfb" // x轴文本颜色
      },
      axisLine: {
        show: false // 去除轴线
      }
    },
    yAxis: {
      type: 'value',
      min: 4,
      max: 5,
      // 去除刻度线
      axisTick: {
        show: false
      },
      axisLabel: {
        color: "#4c9bfb" // x轴文本颜色
      },
      axisLine: {
        show: false // 去除轴线
      },
      splitLine: {
        lineStyle: {
          color: "#012f4a"
        }
      }
    },
    series: [{
      type: 'line',
      smooth: true, // 圆滑的线
      name: '上海水泥价格平均走势图',
      data: []
    }
    ]
  };
  $.get('/echarts2').done(function (data) {
    console.log(data.categorys.slice(0, 5))
    console.log(data.value.slice(0, 5))
    // 填入数据
    myChart.setOption({
      xAxis: {
        data: data.categorys        //flask传递过来的数据categories
      },
      series: [{
        // 根据名字对应到相应的系列
        data: data.value  //flask传递过来的数据data
      }]
    });
  });
  myChart.setOption(option);

  // 4.让图表随屏幕自适应
  window.addEventListener('resize', function () {
    myChart.resize();
  })
})();

//     // 5.点击切换2020 和 2021 的数据
//     $('.line h2 a').on('click', function () {
//       // console.log($(this).index());
//       // 点击a 之后 根据当前a的索引号 找到对应的 yearData 相关对象
//       // console.log(yearData[$(this).index()]);
//       var obj = yearData[$(this).index()];
//       option.series[0].data = obj.data[0];
//       option.series[1].data = obj.data[1];
//       // 选中年份高亮
//       $('.line h2 a').removeClass('a-active');
//       $(this).addClass('a-active');

//       // 需要重新渲染
//       myChart.setOption(option);
//     })
//   })();

// 折线图模块2
(function () {
  var myChart = echarts.init(document.querySelector('.line2 .chart'));
  const upColor = '#ec0000';
  const upBorderColor = '#8A0000';
  const downColor = '#00da3c';
  const downBorderColor = '#008F28';
  // const data0 = splitData([
  //   ['2013/1/24', 2320.26, 2320.26, 2287.3, 2362.94],
  //   ['2013/1/25', 2300, 2291.3, 2288.26, 2308.38],
  //   ['2013/1/28', 2295.35, 2346.5, 2295.35, 2346.92],
  //   ['2013/1/29', 2347.22, 2358.98, 2337.35, 2363.8],
  //   ['2013/1/30', 2360.75, 2382.48, 2347.89, 2383.76],
  //   ['2013/1/31', 2383.43, 2385.42, 2371.23, 2391.82],
  //   ['2013/2/1', 2377.41, 2419.02, 2369.57, 2421.15],
  //   ['2013/2/4', 2425.92, 2428.15, 2417.58, 2440.38],
  //   ['2013/2/5', 2411, 2433.13, 2403.3, 2437.42],
  //   ['2013/2/6', 2432.68, 2434.48, 2427.7, 2441.73],
  //   ['2013/2/7', 2430.69, 2418.53, 2394.22, 2433.89],
  //   ['2013/2/8', 2416.62, 2432.4, 2414.4, 2443.03],
  //   ['2013/2/18', 2441.91, 2421.56, 2415.43, 2444.8],
  //   ['2013/2/19', 2420.26, 2382.91, 2373.53, 2427.07],
  //   ['2013/2/20', 2383.49, 2397.18, 2370.61, 2397.94],
  //   ['2013/2/21', 2378.82, 2325.95, 2309.17, 2378.82],
  //   ['2013/2/22', 2322.94, 2314.16, 2308.76, 2330.88],
  //   ['2013/2/25', 2320.62, 2325.82, 2315.01, 2338.78],
  //   ['2013/2/26', 2313.74, 2293.34, 2289.89, 2340.71],
  //   ['2013/2/27', 2297.77, 2313.22, 2292.03, 2324.63],
  //   ['2013/2/28', 2322.32, 2365.59, 2308.92, 2366.16],
  //   ['2013/3/1', 2364.54, 2359.51, 2330.86, 2369.65],
  //   ['2013/3/4', 2332.08, 2273.4, 2259.25, 2333.54],
  //   ['2013/3/5', 2274.81, 2326.31, 2270.1, 2328.14],
  //   ['2013/3/6', 2333.61, 2347.18, 2321.6, 2351.44],
  //   ['2013/3/7', 2340.44, 2324.29, 2304.27, 2352.02],
  //   ['2013/3/8', 2326.42, 2318.61, 2314.59, 2333.67],
  //   ['2013/3/11', 2314.68, 2310.59, 2296.58, 2320.96],
  //   ['2013/3/12', 2309.16, 2286.6, 2264.83, 2333.29],
  //   ['2013/3/13', 2282.17, 2263.97, 2253.25, 2286.33],
  //   ['2013/3/14', 2255.77, 2270.28, 2253.31, 2276.22],
  //   ['2013/3/15', 2269.31, 2278.4, 2250, 2312.08],
  //   ['2013/3/18', 2267.29, 2240.02, 2239.21, 2276.05],
  //   ['2013/3/19', 2244.26, 2257.43, 2232.02, 2261.31],
  //   ['2013/3/20', 2257.74, 2317.37, 2257.42, 2317.86],
  //   ['2013/3/21', 2318.21, 2324.24, 2311.6, 2330.81],
  //   ['2013/3/22', 2321.4, 2328.28, 2314.97, 2332],
  //   ['2013/3/25', 2334.74, 2326.72, 2319.91, 2344.89],
  //   ['2013/3/26', 2318.58, 2297.67, 2281.12, 2319.99],
  //   ['2013/3/27', 2299.38, 2301.26, 2289, 2323.48],
  //   ['2013/3/28', 2273.55, 2236.3, 2232.91, 2273.55],
  //   ['2013/3/29', 2238.49, 2236.62, 2228.81, 2246.87],
  //   ['2013/4/1', 2229.46, 2234.4, 2227.31, 2243.95],
  //   ['2013/4/2', 2234.9, 2227.74, 2220.44, 2253.42],
  //   ['2013/4/3', 2232.69, 2225.29, 2217.25, 2241.34],
  //   ['2013/4/8', 2196.24, 2211.59, 2180.67, 2212.59],
  //   ['2013/4/9', 2215.47, 2225.77, 2215.47, 2234.73],
  //   ['2013/4/10', 2224.93, 2226.13, 2212.56, 2233.04],
  //   ['2013/4/11', 2236.98, 2219.55, 2217.26, 2242.48],
  //   ['2013/4/12', 2218.09, 2206.78, 2204.44, 2226.26],
  //   ['2013/4/15', 2199.91, 2181.94, 2177.39, 2204.99],
  //   ['2013/4/16', 2169.63, 2194.85, 2165.78, 2196.43],
  //   ['2013/4/17', 2195.03, 2193.8, 2178.47, 2197.51],
  //   ['2013/4/18', 2181.82, 2197.6, 2175.44, 2206.03],
  //   ['2013/4/19', 2201.12, 2244.64, 2200.58, 2250.11],
  //   ['2013/4/22', 2236.4, 2242.17, 2232.26, 2245.12],
  //   ['2013/4/23', 2242.62, 2184.54, 2182.81, 2242.62],
  //   ['2013/4/24', 2187.35, 2218.32, 2184.11, 2226.12],
  //   ['2013/4/25', 2213.19, 2199.31, 2191.85, 2224.63],
  //   ['2013/4/26', 2203.89, 2177.91, 2173.86, 2210.58],
  //   ['2013/5/2', 2170.78, 2174.12, 2161.14, 2179.65],
  //   ['2013/5/3', 2179.05, 2205.5, 2179.05, 2222.81],
  //   ['2013/5/6', 2212.5, 2231.17, 2212.5, 2236.07],
  //   ['2013/5/7', 2227.86, 2235.57, 2219.44, 2240.26],
  //   ['2013/5/8', 2242.39, 2246.3, 2235.42, 2255.21],
  //   ['2013/5/9', 2246.96, 2232.97, 2221.38, 2247.86],
  //   ['2013/5/10', 2228.82, 2246.83, 2225.81, 2247.67],
  //   ['2013/5/13', 2247.68, 2241.92, 2231.36, 2250.85],
  //   ['2013/5/14', 2238.9, 2217.01, 2205.87, 2239.93],
  //   ['2013/5/15', 2217.09, 2224.8, 2213.58, 2225.19],
  //   ['2013/5/16', 2221.34, 2251.81, 2210.77, 2252.87],
  //   ['2013/5/17', 2249.81, 2282.87, 2248.41, 2288.09],
  //   ['2013/5/20', 2286.33, 2299.99, 2281.9, 2309.39],
  //   ['2013/5/21', 2297.11, 2305.11, 2290.12, 2305.3],
  //   ['2013/5/22', 2303.75, 2302.4, 2292.43, 2314.18],
  //   ['2013/5/23', 2293.81, 2275.67, 2274.1, 2304.95],
  //   ['2013/5/24', 2281.45, 2288.53, 2270.25, 2292.59],
  //   ['2013/5/27', 2286.66, 2293.08, 2283.94, 2301.7],
  //   ['2013/5/28', 2293.4, 2321.32, 2281.47, 2322.1],
  //   ['2013/5/29', 2323.54, 2324.02, 2321.17, 2334.33],
  //   ['2013/5/30', 2316.25, 2317.75, 2310.49, 2325.72],
  //   ['2013/5/31', 2320.74, 2300.59, 2299.37, 2325.53],
  //   ['2013/6/3', 2300.21, 2299.25, 2294.11, 2313.43],
  //   ['2013/6/4', 2297.1, 2272.42, 2264.76, 2297.1],
  //   ['2013/6/5', 2270.71, 2270.93, 2260.87, 2276.86],
  //   ['2013/6/6', 2264.43, 2242.11, 2240.07, 2266.69],
  //   ['2013/6/7', 2242.26, 2210.9, 2205.07, 2250.63],
  //   ['2013/6/13', 2190.1, 2148.35, 2126.22, 2190.1]
  // ]);
  function splitData(rawData) {
    const categoryData = [];
    const values = [];
    for (var i = 0; i < rawData.length; i++) {
      categoryData.push(rawData[i].splice(0, 1)[0]);
      values.push(rawData[i]);
    }
    return {
      categoryData: categoryData,
      values: values
    };
  }

  option = {
    title: {
      text: '水泥指数',
      left: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: [],
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax'
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true
      }
    },
    dataZoom: [
      {
        type: 'inside',
        start: 50,
        end: 100
      },
      {
        show: true,
        type: 'slider',
        top: '90%',
        start: 50,
        end: 100
      }
    ],
    series: [
      {
        name: '日K',
        type: 'candlestick',
        data: [],
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: upBorderColor,
          borderColor0: downBorderColor
        },
        markPoint: {
          label: {
            formatter: function (param) {
              return param != null ? Math.round(param.value) + '' : '';
            }
          },
          data: [
            {
              name: 'Mark',
              coord: ['2013/5/31', 2300],
              value: 2300,
              itemStyle: {
                color: 'rgb(41,60,85)'
              }
            },
            {
              name: 'highest value',
              type: 'max',
              valueDim: 'highest'
            },
            {
              name: 'lowest value',
              type: 'min',
              valueDim: 'lowest'
            },
            {
              name: 'average value on close',
              type: 'average',
              valueDim: 'close'
            }
          ],
          tooltip: {
            formatter: function (param) {
              return param.name + '<br>' + (param.data.coord || '');
            }
          }
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
            [
              {
                name: 'from lowest to highest',
                type: 'min',
                valueDim: 'lowest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              },
              {
                type: 'max',
                valueDim: 'highest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                }
              }
            ],
            {
              name: 'min line on close',
              type: 'min',
              valueDim: 'close'
            },
            {
              name: 'max line on close',
              type: 'max',
              valueDim: 'close'
            }
          ]
        }
      },]
  }
  $.get('/echarts4').done(function (data) {
    console.log(data.time)
    console.log(data.lastvalue)
    myChart.setOption({
      xAxis: {
        data: data.time        //flask传递过来的数据categories
      },
      series: [{
        // 根据名字对应到相应的系列
        data: data.lastvalue  //flask传递过来的数据data
      }]
    });

  })
  myChart.setOption(option);
  window.addEventListener('resize', function () {
    myChart.resize();
  })
})();
//饼形图
(function () {
  var myChart = echarts.init(document.querySelector(".pie .chart"));
  var option = {
    color: ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"],
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      // 垂直居中,默认水平居中
      // orient: 'vertical',

      bottom: 'auto',
      left: 'auto',
      // 小图标的宽度和高度
      itemWidth: 10,
      itemHeight: 10,
      // 修改图例组件的文字为 12px
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: "8"
      }
    },
    series: [{
      name: '水泥品牌占比',
      type: 'pie',
      // 设置饼形图在容器中的位置
      center: ["50%", "50%"],
      // 修改饼形图大小，第一个为内圆半径，第二个为外圆半径
      radius: ['25%', '40%'],
      avoidLabelOverlap: false,
      // 图形上的文字
      label: {
        show: false,
        position: 'center',
        fontSize: "3"
      },
      // 链接文字和图形的线
      labelLine: {
        show: false
      },
      data: [
        { value: 0.4375, name: '山东省 济南市' },
        { value: 0.28125, name: '河南省 郑州市' },
        { value: 0.28125, name: '河北省 唐山市' },
        {
          value: 0.25, name: '内蒙古自治区 乌海市'
        },
        {
          value: 0.21875, name: "江苏省 连云港市"
        },
        {
          value: 0.1875, name: "山西省 大同市"
        }
      ]

    }]
  };

  // 填入数据
  // myChart.setOption({
  //   series:
  // }
  // )
  myChart.setOption(option);
  window.addEventListener('resize', function () {
    myChart.resize();
  })
})();

// 饼形图2
(function () {
  var myChart = echarts.init(document.querySelector('.pie2 .chart'));
  var option = {
    color: ['#60cda0', '#ed8884', '#ff9f7f', '#0096ff', '#9fe6b8', '#32c5e9', '#1d9dff'],
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: "rgba(255,255,255,.5)",
        fontSize: 10
      }
    },
    series: [{
      name: '类型分布',
      type: 'pie',
      radius: ["10%", "60%"],
      center: ['50%', '40%'],
      // 半径模式  area面积模式
      roseType: 'radius',
      // 图形的文字标签
      label: {
        fontsize: 10
      },
      // 引导线调整
      labelLine: {
        // 连接扇形图线长(斜线)
        length: 6,
        // 连接文字线长(横线)
        length2: 8
      },
      data: [
      ]
    }]
  };
  myChart.setOption(option);
  $.get('/echarts3').done(function (data) {
    // 填入数据
    myChart.setOption({
      series: [{
        // 根据名字对应到相应的系列
        data: data.data.slice(0, 5)  //flask传递过来的数据data
      }]
    })
  }
  );
  window.addEventListener('resize', function () {
    myChart.resize();
  })
})();
// 模拟飞行路线地图
(function () {
  var myChart = echarts.init(document.querySelector(".map .chart"));
  var geoCoordMap = {
    '上海': [121.4648, 31.2891],
    '东莞': [113.8953, 22.901],
    '东营': [118.7073, 37.5513],
    '中山': [113.4229, 22.478],
    '临汾': [111.4783, 36.1615],
    '临沂': [118.3118, 35.2936],
    '丹东': [124.541, 40.4242],
    '丽水': [119.5642, 28.1854],
    '乌鲁木齐': [87.9236, 43.5883],
    '佛山': [112.8955, 23.1097],
    '保定': [115.0488, 39.0948],
    '兰州': [103.5901, 36.3043],
    '包头': [110.3467, 41.4899],
    '北京': [116.4551, 40.2539],
    '北海': [109.314, 21.6211],
    '南京': [118.8062, 31.9208],
    '南宁': [108.479, 23.1152],
    '南昌': [116.0046, 28.6633],
    '南通': [121.1023, 32.1625],
    '厦门': [118.1689, 24.6478],
    '台州': [121.1353, 28.6688],
    '合肥': [117.29, 32.0581],
    '呼和浩特': [111.4124, 40.4901],
    '咸阳': [108.4131, 34.8706],
    '哈尔滨': [127.9688, 45.368],
    '唐山': [118.4766, 39.6826],
    '嘉兴': [120.9155, 30.6354],
    '大同': [113.7854, 39.8035],
    '大连': [122.2229, 39.4409],
    '天津': [117.4219, 39.4189],
    '太原': [112.3352, 37.9413],
    '威海': [121.9482, 37.1393],
    '宁波': [121.5967, 29.6466],
    '宝鸡': [107.1826, 34.3433],
    '宿迁': [118.5535, 33.7775],
    '常州': [119.4543, 31.5582],
    '广州': [113.5107, 23.2196],
    '廊坊': [116.521, 39.0509],
    '延安': [109.1052, 36.4252],
    '张家口': [115.1477, 40.8527],
    '徐州': [117.5208, 34.3268],
    '德州': [116.6858, 37.2107],
    '惠州': [114.6204, 23.1647],
    '成都': [103.9526, 30.7617],
    '扬州': [119.4653, 32.8162],
    '承德': [117.5757, 41.4075],
    '拉萨': [91.1865, 30.1465],
    '无锡': [120.3442, 31.5527],
    '日照': [119.2786, 35.5023],
    '昆明': [102.9199, 25.4663],
    '杭州': [119.5313, 29.8773],
    '枣庄': [117.323, 34.8926],
    '柳州': [109.3799, 24.9774],
    '株洲': [113.5327, 27.0319],
    '武汉': [114.3896, 30.6628],
    '汕头': [117.1692, 23.3405],
    '江门': [112.6318, 22.1484],
    '沈阳': [123.1238, 42.1216],
    '沧州': [116.8286, 38.2104],
    '河源': [114.917, 23.9722],
    '泉州': [118.3228, 25.1147],
    '泰安': [117.0264, 36.0516],
    '泰州': [120.0586, 32.5525],
    '济南': [117.1582, 36.8701],
    '济宁': [116.8286, 35.3375],
    '海口': [110.3893, 19.8516],
    '淄博': [118.0371, 36.6064],
    '淮安': [118.927, 33.4039],
    '深圳': [114.5435, 22.5439],
    '清远': [112.9175, 24.3292],
    '温州': [120.498, 27.8119],
    '渭南': [109.7864, 35.0299],
    '湖州': [119.8608, 30.7782],
    '湘潭': [112.5439, 27.7075],
    '滨州': [117.8174, 37.4963],
    '潍坊': [119.0918, 36.524],
    '烟台': [120.7397, 37.5128],
    '玉溪': [101.9312, 23.8898],
    '珠海': [113.7305, 22.1155],
    '盐城': [120.2234, 33.5577],
    '盘锦': [121.9482, 41.0449],
    '石家庄': [114.4995, 38.1006],
    '福州': [119.4543, 25.9222],
    '秦皇岛': [119.2126, 40.0232],
    '绍兴': [120.564, 29.7565],
    '聊城': [115.9167, 36.4032],
    '肇庆': [112.1265, 23.5822],
    '舟山': [122.2559, 30.2234],
    '苏州': [120.6519, 31.3989],
    '莱芜': [117.6526, 36.2714],
    '菏泽': [115.6201, 35.2057],
    '营口': [122.4316, 40.4297],
    '葫芦岛': [120.1575, 40.578],
    '衡水': [115.8838, 37.7161],
    '衢州': [118.6853, 28.8666],
    '西宁': [101.4038, 36.8207],
    '西安': [109.1162, 34.2004],
    '贵阳': [106.6992, 26.7682],
    '连云港': [119.1248, 34.552],
    '邢台': [114.8071, 37.2821],
    '邯郸': [114.4775, 36.535],
    '郑州': [113.4668, 34.6234],
    '鄂尔多斯': [108.9734, 39.2487],
    '重庆': [107.7539, 30.1904],
    '金华': [120.0037, 29.1028],
    '铜川': [109.0393, 35.1947],
    '银川': [106.3586, 38.1775],
    '镇江': [119.4763, 31.9702],
    '长春': [125.8154, 44.2584],
    '长沙': [113.0823, 28.2568],
    '长治': [112.8625, 36.4746],
    '阳泉': [113.4778, 38.0951],
    '青岛': [120.4651, 36.3373],
    '韶关': [113.7964, 24.7028]
  };



  // var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
  //var planePath = 'arrow';
  var data1 = [
    {
      "name": "上海",
      "value": 4.476
    },
    {
      "name": "内蒙古",
      "value": 4.51
    },
    {
      "name": "北京",
      "value": 4.7565
    },
    {
      "name": "吉林",
      "value": 4.56
    },
    {
      "name": "天津",
      "value": 4.22
    }
    , {
      "name": "安徽",
      "value": 3.73
    },
    {
      "name": "山东",
      "value": 4.311
    },
    {
      "name": "南京",
      "value": 4.28
    },
    {
      "name": "菏泽",
      "value": 4.30
    },
    {
      "name": "秦皇岛",
      "value": 3.5
    },
    {
      "name": "沧州",
      "value": 4.23
    },
    {
      "name": "杭州",
      "value": 4.12
    }];

  var convertData = function (data) {

    var res = [];
    for (var i = 0; i < data.length; i++) {

      var dataItem = data[i];

      var fromCoord = geoCoordMap[dataItem.name];
      // var toCoord = geoCoordMap[dataItem[1].name];
      if (fromCoord) {
        res.push({
          name: dataItem.name,
          // toName: dataItem[
          value: fromCoord.concat(dataItem.value)

        });
      }
    }
    return res;

  };

  var color = ['#a6c84c', '#ffa022', '#46bee9']; //航线的颜色


  // },
  // {
  //     type: 'map',
  //     map: mapName,
  //     geoIndex: 0,
  //     aspectScale: 0.75, //长宽比
  //     showLegendSymbol: false, // 存在legend时显示
  //     label: {
  //         normal: {
  //             show: true
  //         },
  //         emphasis: {
  //             show: false,
  //             textStyle: {
  //                 color: '#fff'
  //             }
  //         }
  //     },
  //     roam: true,
  //     itemStyle: {
  //         normal: {
  //             areaColor: '#031525',
  //             borderColor: '#3B5077',
  //         },
  //         emphasis: {
  //             areaColor: '#2B91B7'
  //         }
  //     },
  //     animation: false,
  //     data: data
  // },
  // {
  //     name: '点',
  //     type: 'scatter',
  //     coordinateSystem: 'geo',
  //     symbol: 'pin', //气泡
  //     symbolSize: function (val) {
  //         var a = (maxSize4Pin - minSize4Pin) / (max - min);
  //         var b = minSize4Pin - a * min;
  //         b = maxSize4Pin - a * max;
  //         return a * val[2] + b;
  //     },
  //     label: {
  //         normal: {
  //             show: true,
  //             formatter: function (params) {
  //                 // console.log("aaa");
  //                 // console.log(params);
  //                 return params.value[2]
  //             },
  //             textStyle: {
  //                 color: '#fff',
  //                 fontSize: 9,
  //             }
  //         }
  //     },
  //     itemStyle: {
  //         normal: {
  //             color: 'rgba(255,255,0,0)', //标志颜色
  //         }
  //     },
  //     zlevel: 6,
  //     data: convertData(data),
  // },
  // {
  //     name: 'Top 5',//用于显示最高的前五个数据
  //     type: 'effectScatter',
  //     coordinateSystem: 'geo',
  //     data: convertData(data.sort(function (a, b) {
  //         return b.value - a.value;
  //     }).slice(0, 5)),
  //     symbolSize: function (val) {
  //         return val[2] / 5;
  //     },
  //     showEffectOn: 'render',
  //     rippleEffect: {
  //         brushType: 'stroke'
  //     },
  //     hoverAnimation: true,
  //     label: {
  //         normal: {
  //             formatter: '{b}',
  //             position: 'right',
  //             show: true
  //         }
  //     },
  //     itemStyle: {
  //         normal: {
  //             color: 'rgba(255,255,0,0.8)',
  //             shadowBlur: 10,
  //             shadowColor: '#05C3F9'
  //         }
  //     },
  //     zlevel: 1
  //

  var option = {
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        var temp = params['data']['name'] + ':' + params['data']['value'][2]
        return temp;
      },
      show: true,
      position: 'top',
    },
    series: [{
      //对有数据的省份画点
      name: data1.name,
      type: 'scatter',
      coordinateSystem: 'geo',
      data: convertData(data1),
      symbolSize: function (val) {
        //用来设置每个省份圆圈的大小
        return val[2] * 3;
      },
      label: {
        show: true,
        normal: {
          formatter: '{@[2]}',
          position: 'right',
          show: true,//是否显示省份的名称
        },
        emphasis: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          color: 'rgba(255,255,0,0.8)'
        }
      }
    }],

    geo: {
      map: 'china',
      // 把地图放大1.2倍
      zoom: 1.2,
      label: {
        // 鼠标移动显示区域名称
        emphasis: {
          show: true,
          color: '#fff'
        }
      },
      roam: true,
      // 地图样式修改
      itemStyle: {
        normal: {
          areaColor: 'rgba(34, 70, 168, 0.7)',
          borderColor: '#0692a4'
        },
        emphasis: {
          areaColor: 'rgba(119, 139, 224, 0.548)'
        }
      }
    },
    // series: series
  };
  console.log(data1);
  console.log(convertData(data1))
  console.log()
  myChart.setOption(option);
  window.addEventListener('resize', function () {
    myChart.resize();
  })
})
  ()