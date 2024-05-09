// 运行时配置
import { RunTimeLayoutConfig, RuntimeAntdConfig, history } from '@umijs/max';
import { theme } from 'antd';
import { getActiveTheme } from '@/services/dwst/themes';
import { currentUser as queryCurrentUser } from './services/dwst/login';
import type { ThemeConfigProp } from '@/services/dwst/themes';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';

const loginPath = '/login';
const themeJson = await getActiveTheme();
const themeConfigObj = themeJson.data;
function isThemeConfigProp(obj: ThemeConfigProp|{Error: string}): obj is ThemeConfigProp {
  return "theme" in obj
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
//Promise<{name: string, themeType?: string | string[], themeName?: string}>
export async function getInitialState():  Promise<{
  name: string;
  themeType?: string | string[];
  themeName?: string;
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> { 
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      // name: '德为专家',
      name: currentUser?.name ? currentUser?.name : '德为专家',
      themeType: isThemeConfigProp(themeConfigObj) ? themeConfigObj.theme.algorithm : undefined,
      themeName: isThemeConfigProp(themeConfigObj) ? themeConfigObj.name : undefined,
      fetchUserInfo,
      currentUser,
      settings: layout as Partial<LayoutSettings>,
    };
  }
  return {
    name: '德为专家',
    themeType: isThemeConfigProp(themeConfigObj) ? themeConfigObj.theme.algorithm : undefined,
    themeName: isThemeConfigProp(themeConfigObj) ? themeConfigObj.name : undefined,
    fetchUserInfo,
    settings: layout as Partial<LayoutSettings>,
  };
  // return { 
  //   name: '德为专家',
  //   themeType: isThemeConfigProp(themeConfigObj) ? themeConfigObj.theme.algorithm : undefined,
  //   themeName: isThemeConfigProp(themeConfigObj) ? themeConfigObj.name : undefined,
  // };
}

export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {
  return {
    iconfontUrl: '//at.alicdn.com/t/c/font_2689913_7gxs5gt1j0v.js',
    title: '全时空监控',
    logo: '/dwst_logo_noname_bak.png',
    menu: {
      locale: false,
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // rightRender: (initialState) => {
    //   return (

    //   )
    // }
  };
};

/** 从/public/theme.json读取激活的主题配置并应用。 */
export const antd: RuntimeAntdConfig = (memo) => {
  if (isThemeConfigProp(themeConfigObj)) {
    memo.theme ??= {
      token: themeConfigObj.theme.token,
    };
    memo.theme.algorithm = themeConfigObj.theme.algorithm.includes('defaultAlgorithm') ? [theme.defaultAlgorithm] : [theme.darkAlgorithm]; 
  }
  return memo;
}