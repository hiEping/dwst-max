import { Space, Switch, version, theme, MappingAlgorithm, Radio, Form, Button  } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useAntdConfig, useAntdConfigSetter } from '@umijs/max';
import { useState } from 'react';
const { darkAlgorithm, defaultAlgorithm } = theme;

export default function Page() {
  const setAntdConfig = useAntdConfigSetter();
  const antdConfig = useAntdConfig();  
  const [form] = Form.useForm();
  const [themeValue, setThemeValue] = useState('default');
  function handleThemeChange(changeValue: string) {
    setThemeValue(changeValue);
    // const themeAlgorithm = changeValue.includes('dark')?darkAlgorithm:defaultAlgorithm;
    switch (changeValue) {
      case 'dark':
        setAntdConfig({
          theme: {
            algorithm: [darkAlgorithm],
            token: {
              "colorPrimary": "#2c76e6",
              "colorInfo": "#2c76e6",
              "colorTextBase": "#fff",
              "colorBgBase": "#000"
            }
          }
        })
        break;
      case 'dark-blue':
        setAntdConfig({
          theme: {
            algorithm: [darkAlgorithm],
            token: {
              "colorPrimary": "#2c76e6",
              "colorInfo": "#2c76e6",
              "colorTextBase": "#fff",
              "colorBgBase": "#141425"  
            }
          }
        })
        break;
      case 'light-green':
        setAntdConfig({
          theme: {
            algorithm: [defaultAlgorithm],
            token: {
              "colorPrimary": "#0b8105",
              "colorInfo": "#0b8105",
              "colorTextBase": "#000",
              "colorBgBase": "#d9e9d9"
            },
            components: {
              Button: {}
            }
          }
        })
        break;
      default:
        setAntdConfig({
          theme: {
            algorithm: [defaultAlgorithm],
            token: {
              "colorPrimary": "#2c76e6",
              "colorInfo": "#2c76e6",
              "colorTextBase": "#000",
              "colorBgBase": "#fff",
            }
          }
        })
    }    
  }
  return (
    <PageContainer>
      <p>with antd@{version}</p>
      <Form>
        <Form.Item label="设置主题风格" name="layout">
          <Radio.Group optionType='button' defaultValue={'default'} value={themeValue} onChange={(e)=>handleThemeChange(e.target.value)} buttonStyle='solid'>
            <Radio.Button value="default">纯净白</Radio.Button>
            <Radio.Button value="light-green">春天绿</Radio.Button>
            <Radio.Button value="dark">深空黑</Radio.Button>
            <Radio.Button value="dark-blue">暗夜蓝</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </PageContainer>
  );
}