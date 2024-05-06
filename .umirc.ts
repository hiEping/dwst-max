import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    configProvider:{},
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'DWST',
  },
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      name: '工作台',
      path: '/workplace',
      icon: 'icon-xingzhuang',
      component: 'Workplace',
    },
    {
      name: '大屏展示',
      path: '/bigscreen',
      icon: 'icon-statistics',
      routes: [
        {
          name: '数据地图',
          path: '/bigscreen/datamap',
          component: 'Bigscreen/DataMap',
        },
        {
          name: '事件处理',
          path: '/bigscreen/eventhandling',
          component: 'Bigscreen/EventHandling',
        },
        {
          name: '轨迹跟踪',
          path: '/bigscreen/vehtracking',
          component: 'Bigscreen/VehTracking',
        }
      ]
    },
    {
      name: '数据看板',
      path: '/dashboard',
      icon: 'icon-biaoge',
      routes: [
        {
          name: '事件检测',
          path: '/dashboard/eventdata',
          component: 'Dashboard/EventData',
        },
        {
          name: '交通状况',
          path: '/dashboard/traffic',
          component: 'Dashboard/Traffic',
        },
        {
          name: '行车风险',
          path: '/dashboard/drivingrisk',
          component: 'Dashboard/DrivingRisk',
        },
        {
          name: '风险报告',
          path: '/dashboard/riskreport',
          component: 'Dashboard/RiskReport',
        },
      ]
    },
    {
      name: '系统管理',
      path: '/sysmanage',
      icon: 'icon-xitongguanli',
      routes: [
        {
          name: '基本参数',
          path: '/sysmanage/basiccode',
          component: 'SystemMng/BasicCode'
        },
        {
          name: '相机配置',
          path: '/sysmanage/camconfig',
          component: 'SystemMng/CamConfig'
        },
        {
          name: '检测参数',
          path: '/sysmanage/DetParam',
        },
        {
          name: '系统维护',
          path: '/sysmanage/Maintenance',
        },
        {
          name: '界面设置',
          path: '/sysmanage/ui',
          component: 'SystemMng/Ui'
        },
        {
          name: '其他',
          path: '/sysmanage/others',
          component: 'SystemMng/Others'
        },
      ]
    },
    {
      name: '欢迎',
      path: '/welcome',
      icon: 'icon-smile',
      component: 'Welcome',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    // {
    //   name: ' CRUD 示例',
    //   path: '/table',
    //   component: './Table',
    // },
  ],
  npmClient: 'pnpm',
});
