<template>
  <div>
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
import { http, articlelist, articlebychannel } from "../api/api";
export default {
  data(){
    return{

    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    // 绘画统计图
    view(arr1,arr2) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "文章统计"
        },
        tooltip: {},
        xAxis: {
          data: arr1
        },
        yAxis: {},
        series: [
          {
            name: "数量",
            type: "bar",
            data: arr2
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    getData() {
      // 获取数据
      Promise.all([
        //一次发送两个ajax请求
        this.$http.get(http + articlelist),
        this.$http.get(http + articlebychannel)
      ]).then(
        data => {
          // 文章列表信息
          var articleList = data[0].data.data
          // 文章数量
          var articleNum = data[1].data.data
          // 迭代新的数组
          // 文章列表信息数组
          var articleListArr = articleList.map(item=>item.name);
          // 文章数量数组
          var articleNumArr = articleNum.map(item=>item.articles);
          // 绘制图表
          this.view(articleListArr,articleNumArr);
        },
        err => {
          console.log(err);
        }
      );
    }
  }
};
</script>

<style>
</style>