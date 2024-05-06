import { useAntdConfig, useAntdConfigSetter } from '@umijs/max';
import { Space, version, theme, Switch, Form, Radio, Divider, Button, Drawer, message, Card } from 'antd';
import { getActiveTheme, getThemes } from '@/services/dwst/themes';
import type { ThemeConfigProp } from '@/services/dwst/themes';
import { FooterToolbar, PageContainer, ProDescriptions, ProTable, ActionType, ProDescriptionsItemProps, } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import CreateForm from '@/components/SystemMng/Ui/CreateForm';
import UpdateForm, { FormValueType } from '@/components/SystemMng/Ui/UpdateForm';
import { useRef, useState } from 'react';
import services from '@/services/demo';
const { darkAlgorithm, defaultAlgorithm } = theme;
// const themeJson = await getActiveTheme();  //激活的主题
// const themeConfigObj = themeJson.data;
const themeListJson = await getThemes();    //所有的主题
const themeList = themeListJson.data;

function isThemeConfigProp(obj: ThemeConfigProp|{Error: string}): obj is ThemeConfigProp {
  return "theme" in obj
}

const { addUser, queryUserList, deleteUser, modifyUser } =
  services.UserController;
/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    );
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser({
      userId: selectedRows.find((row) => row.id)?.id || '',
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

export default function Page() {
  const {initialState, setInitialState} = useModel('@@initialState');
  const setAntdConfig = useAntdConfigSetter();
  ////////  
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.UserInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      tooltip: '名称是唯一的 key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      valueType: 'text',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      hideInForm: true,
      valueEnum: {
        0: { text: '男', status: 'MALE' },
        1: { text: '女', status: 'FEMALE' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            配置
          </a>
          <Divider type="vertical" />
          <a href="">订阅警报</a>
        </>
      ),
    },
  ];
  ////////
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
      <Divider type='horizontal' orientation='left'/>
      <Card title='组件效果'>
        <ProTable<API.UserInfo>
          headerTitle="查询表格"
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              key="1"
              type="primary"
              onClick={() => handleModalVisible(true)}
            >
              新建
            </Button>,
          ]}
          request={async (params, sorter, filter) => {
            const { data, success } = await queryUserList({
              ...params,
              // FIXME: remove @ts-ignore
              // @ts-ignore
              sorter,
              filter,
            });
            return {
              data: data?.list || [],
              success,
            };
          }}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          }}
        />
        {selectedRowsState?.length > 0 && (
          <FooterToolbar
            extra={
              <div>
                已选择{' '}
                <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
                项&nbsp;&nbsp;
              </div>
            }
          >
            <Button
              onClick={async () => {
                await handleRemove(selectedRowsState);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              批量删除
            </Button>
            <Button type="primary">批量审批</Button>
          </FooterToolbar>
        )}
      </Card>      
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.UserInfo, API.UserInfo>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<API.UserInfo>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
}