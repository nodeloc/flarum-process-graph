import app from 'flarum/forum/app';
import UserPage from 'flarum/forum/components/UserPage';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Select from 'flarum/common/components/Select';

export default class AuthorizedPage extends UserPage {
  loading = true;
  graphData = null;
  graph = null;
  resize_handler_bound = false;
  read_permission = app.session.user.attribute("read_permission");
  discussionCount = app.session.user.attribute("discussionCount");
  commentCount =  app.session.user.attribute("commentCount");
  user_help_count = app.session.user.attribute("bestAnswerCount");
  upgrade_help_count = 20;
  left_help_count = this.upgrade_help_count-this.user_help_count > 0 ? this.upgrade_help_count-this.user_help_count : 0;
  user_lottery_count =0;
  upgrade_lottery_count = 10;
  level =0;
  userLevel = 0;
  nextLevel = "";
  nextPermission = 0;
  discussionUpgradeInfo  = {};
  count_help = 0;
  count_lottery =0;
  upgrade_info = [
    { gid: 19, discussion_start: 5, post_count: 10 ,read_permission :0},
    { gid: 20, discussion_start: 10, post_count: 50 ,read_permission :20},
    { gid: 21, discussion_start: 50, post_count: 100 ,read_permission :50},
    { gid: 22, discussion_start: 60, post_count: 60,read_permission :100 },
    { gid: 23, discussion_start: 200, post_count: 500,read_permission :120 },
    { gid: 24, discussion_start: 500, post_count: 1000 ,read_permission :500}
  ];
  options = {
    19: '青铜会员',
    20: '白银会员',
    21: '黄金会员',
    22: '钻石会员',
    23: '王者会员',
    24: '宗师会员'
  };
  oninit(vnode) {
    super.oninit(vnode);
    this.loadUser(m.route.param('username'));
    this.userLevel = this.determineMembershipLevel(this.discussionCount, this.commentCount);
    this.discussionUpgradeInfo = this.findUpgradeInfo(this.userLevel);
    this.nextLevel = this.options[this.discussionUpgradeInfo['gid']];
    this.nextPermission=this.discussionUpgradeInfo['read_permission'];

   // setTimeout(() => {
      this.loadGraph(); // 在延迟后加载图形数据
    //}, 100); // 延迟加载内容，以确保在组件完全附加到 DOM 后执行
  }

  loadGraph() {
    this.loading = true;
    app.request({
      method: 'GET',
      url: app.forum.attribute('apiUrl') + '/process-graph',
      params: {user_id: this.user.id()},
    }).then(result => {
      this.loading = false;
      this.user_lottery_count = result.total;
      m.redraw();
      this.renderGraph();
    });
  }

  renderGraph() {
    if (!window.echarts) {
      setTimeout(() => this.renderGraph(), 200);
      return;
    }
    const graph_container = document.getElementById('process-graph');
    if (!graph_container) return;
    const graph_container2 = document.getElementById('process-graph2');
    if (!graph_container2) return;
    const graph_container3 = document.getElementById('process-graph3');
    if (!graph_container3) return;
    const graph_container4 = document.getElementById('process-graph4');
    if (!graph_container4) return;
    this.chart = this.chart || window.echarts.init(graph_container) ;
    this.chart2 = this.chart2 || window.echarts.init(graph_container2) ;
    this.chart3 = this.chart3 || window.echarts.init(graph_container3) ;
    this.chart4 = this.chart4 || window.echarts.init(graph_container4) ;
    // Determine user's current membership level for discussions

    let leftDiscussionData, leftCommentData;
    if (this.level && this.options[this.level]) {
      // 如果 Select 有值，则使用 Select 的值
      let selectedUpgradeInfo = this.findUpgradeInfo(this.level);
      leftDiscussionData = selectedUpgradeInfo['discussion_start'] - this.discussionCount > 0 ? selectedUpgradeInfo['discussion_start'] - this.discussionCount : 0;
      leftCommentData = selectedUpgradeInfo['post_count'] - this.commentCount > 0 ? selectedUpgradeInfo['post_count'] - this.commentCount : 0;
    } else {
      // 如果 Select 没有值，则使用默认的 discussionUpgradeInfo
      if (this.discussionUpgradeInfo) {
        leftDiscussionData = this.discussionUpgradeInfo['discussion_start'] - this.discussionCount > 0 ? this.discussionUpgradeInfo['discussion_start'] - this.discussionCount : 0;
        leftCommentData = this.discussionUpgradeInfo['post_count'] - this.commentCount > 0 ? this.discussionUpgradeInfo['post_count'] - this.commentCount : 0;
      } else {
        // 在这里处理没有 discussionUpgradeInfo 的情况
        leftDiscussionData = 0;
        leftCommentData = 0;
      }
    }
    // Set graph data based on upgrade info for discussions
    this.chart.setOption({
      title: {
        text:leftDiscussionData +'主题',//主标题文本
        subtext:'升级还需要',//副标题文本
        left:'23%',
        top:'51%',
        textStyle:{
          fontWeight: 'normal',
          fontSize: 18,
          color:'#009966',
          align:'center',
          left:10
        },
        subtextStyle:{
          fontSize: 13,
          color:'#6c7a89',
        }
      },
      legend: {
        top: 20,
        right:20
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['70%', '80%'],
          center: ["30%", "60%"],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            normal: {
              show: false,
              position: "center",
            },
            emphasis: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: this.commentCount,
              selected:false,
              itemStyle: {
                color: "#009966",
              },
            },
            {
              value: leftDiscussionData,
              name: "",
              itemStyle: {
                color: "#E9EEF4",
              },
              label:{
                normal:{
                  show:false,
                }
              }
            },
          ]
        }
      ]
    });

    // Set graph data based on upgrade info for comments
    this.chart2.setOption({
      title: {
        text:leftCommentData+'回复',//主标题文本
        subtext:'升级还需要',//副标题文本
        left:'23%',
        top:'51%',
        textStyle:{
          fontWeight: 'normal',
          fontSize: 18,
          color:'#009966',
          align:'center',
        },
        subtextStyle:{
          fontSize: 13,
          color:'#6c7a89',
        }
      },
      legend: {
        top: 20,
        right:20
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['70%', '80%'],
          center: ["30%", "60%"],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            normal: {
              show: false,
              position: "center",
            },
            emphasis: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: this.discussionCount,
              selected:false,
              itemStyle: {
                color: "#009966",
              },
            },
            {
              value: leftCommentData,
              name: "",
              itemStyle: {
                color: "#E9EEF4",
              },
              label:{
                normal:{
                  show:false,

                }
              }
            },
          ]
        }
      ]
    });

    this.chart3.setOption({
      title: {
        text:this.left_help_count+'次最佳答案',//主标题文本
        subtext:'升级还需要',//副标题文本
        left:'23%',
        top:'51%',
        textStyle:{
          fontWeight: 'normal',
          fontSize: 18,
          color:'#009966',
          align:'center',
        },
        subtextStyle:{
          fontSize: 13,
          color:'#6c7a89',
        }
      },
      legend: {
        top: 20,
        right:20
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['70%', '80%'],
          center: ["30%", "60%"],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            normal: {
              show: false,
              position: "center",
            },
            emphasis: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: this.user_help_count,
              selected:false,
              itemStyle: {
                color: "#009966",
              },
            },
            {
              value: this.left_help_count,
              name: "",
              itemStyle: {
                color: "#E9EEF4",
              },
              label:{
                normal:{
                  show:false,

                }
              }
            },
          ]
        }
      ]
    });
    let leftLotteryCount = this.upgrade_lottery_count- this.user_lottery_count > 0 ? this.upgrade_lottery_count- this.user_lottery_count : 0;
    this.chart4.setOption({
      title: {
        text:'发布'+leftLotteryCount+'次抽奖',//主标题文本
        subtext:'升级还需要',//副标题文本
        left:'23%',
        top:'51%',
        textStyle:{
          fontWeight: 'normal',
          fontSize: 18,
          color:'#009966',
          align:'center',
        },
        subtextStyle:{
          fontSize: 13,
          color:'#6c7a89',
        }
      },
      legend: {
        top: 20,
        right:20
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['70%', '80%'],
          center: ["30%", "60%"],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            normal: {
              show: false,
              position: "center",
            },
            emphasis: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: this.user_lottery_count,
              selected:false,
              itemStyle: {
                color: "#009966",
              },
            },
            {
              value: leftLotteryCount,
              name: "",
              itemStyle: {
                color: "#E9EEF4",
              },
              label:{
                normal:{
                  show:false,

                }
              }
            },
          ]
        }
      ]
    });

    if (!this.resize_handler_bound) {
      window.addEventListener('resize', () => {
        this.chart.resize();
        this.chart2.resize();
        this.chart3.resize();
        this.chart4.resize();
      });
      this.resize_handler_bound = true;
    }
  }

  determineMembershipLevel(discussionCount, commentCount) {
    let totalPosts = discussionCount + commentCount;
    for (let i = this.upgrade_info.length - 1; i >= 0; i--) {
      let levelInfo = this.upgrade_info[i];
      if (totalPosts >= levelInfo.discussion_start) {
        return levelInfo.gid;
      }
    }
    return 0; // User is below the lowest membership level
  }

  findUpgradeInfo(level) {
    return this.upgrade_info.find(info => info.gid == level);
  }
  content() {
    return <div className="process-graph-page">
      <h2>{app.translator.trans('nodeloc-process-graph.forum.label.process_graph')}</h2>
      <div style="display: flex; justify-content: space-between; align-items: end;">
        <span>{app.translator.trans('nodeloc-process-graph.forum.label.total_times', {total: this.read_permission})} <br/>下一等级  {this.nextLevel} ,  阅读权限  {this.nextPermission}</span>
        <Select
          options={this.options}
          value={this.level}
          onchange={value => {
            this.level = value;
            this.loadGraph();
          }}
        >
        </Select>
      </div>
      <div className="process-graph-container">
        <div className="process-graph-item">
          <div id="process-graph" style="height: 250px;"></div>
        </div>
        <div className="process-graph-item">
          <div id="process-graph2" style="height: 250px;"></div>
        </div>
      </div>
      <hr/>
      <h2>乐于助人</h2>
      <div style="display: flex; justify-content: space-between; align-items: end;">
        <span>在有求助的标签中回复并被选中为最佳答案为一次助人，20次助人可获得此用户组，用户组权限255</span>
      </div>
      <div className="process-graph-container">
        <div className="process-graph-item">
          <div id="process-graph3" style="height: 250px;"></div>
        </div>
      </div>
      <hr/>
      <h2>乐善好施</h2>
      <div style="display: flex; justify-content: space-between; align-items: end;">
        <span>发布抽奖20次可获得此用户组，用户组权限255</span>
      </div>
      <div className="process-graph-container">
        <div className="process-graph-item">
          <div id="process-graph4" style="height: 250px;"></div>
        </div>
      </div>
    </div>;
  }

}
