// 运行时配置
import { RunTimeLayoutConfig, RuntimeAntdConfig } from '@umijs/max';
import { theme } from 'antd';
import { getActiveTheme } from '@/services/dwst/themes';
import type { ThemeConfigProp } from '@/services/dwst/themes';

const themeJson = await getActiveTheme();
const themeConfigObj = themeJson.data;
function isThemeConfigProp(obj: ThemeConfigProp|{Error: string}): obj is ThemeConfigProp {
  return "theme" in obj
}

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{name: string, themeType?: string | string[], themeName?: string}> { 
  return { 
    name: '德为专家',
    themeType: isThemeConfigProp(themeConfigObj) ? themeConfigObj.theme.algorithm : undefined,
    themeName: isThemeConfigProp(themeConfigObj) ? themeConfigObj.name : undefined,
  };
}

export const layout: RunTimeLayoutConfig = (initialState) => {
  return {
    iconfontUrl: '//at.alicdn.com/t/c/font_2689913_7gxs5gt1j0v.js',
    title: '全时空监控',
    logo: '/dwst_logo_noname_bak.png',
    menu: {
      locale: false,
    },
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