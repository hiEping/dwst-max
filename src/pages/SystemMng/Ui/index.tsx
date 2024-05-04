import { useAntdConfig, useAntdConfigSetter } from '@umijs/max';
import { Space, version, theme, Switch, Form, Radio, Divider } from 'antd';
import { getActiveTheme, getThemes } from '@/services/dwst/themes';
import type { ThemeConfigProp } from '@/services/dwst/themes';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
const { darkAlgorithm, defaultAlgorithm } = theme;
const themeJson = await getActiveTheme();  //激活的主题
const themeConfigObj = themeJson.data;
const themeListJson = await getThemes();    //所有的主题
const themeList = themeListJson.data;

function isThemeConfigProp(obj: ThemeConfigProp|{Error: string}): obj is ThemeConfigProp {
  return "theme" in obj
}

export default function Page() {
  const {initialState, setInitialState} = useModel('@@initialState');
  const setAntdConfig = useAntdConfigSetter();
  return (
    <PageContainer>
      with antd@{version}
      <Divider type='horizontal' orientation='left'/>      
      {
        Array.isArray(themeList) && <Radio.Group 
          buttonStyle='solid' 
          // defaultValue={isThemeConfigProp(themeConfigObj) ? themeConfigObj.name : undefined}
          defaultValue={initialState?.themeName}
          onChange={(e) => {          
            for (let i=0; i<themeList.length; i++) {
              if (themeList[i].name === e.target.value) {
                setInitialState((init) => {
                  return {
                    name: init?.name,
                    themeName: themeList[i].name,
                    themeType: themeList[i].theme.algorithm,
                  }
                })
                const newTheme = {
                  token: themeList[i].theme.token,
                  algorithm: [themeList[i].theme.algorithm.includes("darkAlgorithm") ? darkAlgorithm : defaultAlgorithm]
                }
                setAntdConfig({
                  theme: newTheme
                })
              }
            }
          }}
        >
          {themeList.map((val: ThemeConfigProp) => <Radio.Button value={val.name} key={val.name}>{val.beautyName}</Radio.Button>)}
        </Radio.Group>
      }   
    </PageContainer>
  );
}