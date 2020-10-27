/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link, useIntl, connect, Dispatch, withRouter } from 'umi';
// import  from 'umi/withRouter';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';
// import dComponent from  '@/pages/dynamic/index';
import * as allIcons from '@ant-design/icons';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="对不起，您没有权限查看"
    extra={
      <Button type="primary">
        <Link to="/user/login">去登录</Link>
      </Button>
    }
  />
);
export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

const toHump = (name: string) =>
name.replace(/-(\w)/g, (all: string, letter: any) => letter.toUpperCase());

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    if(item.icon && Object.prototype.toString.call(item.icon)==='[object String]') {
      const { icon } = item;
      const v4IconName = toHump(icon.replace(icon[0], icon[0].toUpperCase()));
      const NewIcon = allIcons[icon] || allIcons[''.concat(v4IconName, 'Outlined')];
      if (NewIcon) {
        try {
          // eslint-disable-next-line no-param-reassign
          item.icon = React.createElement(NewIcon);
        } catch (error) {
          console.log(error);
        }
      }
    }
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };

    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

  const menuDataRenderWrap = (menuList: MenuDataItem[]): MenuDataItem[]=>{

    


    menuList.push({
      icon: 'smile',
      name:  'xxx',
      path: '/template',
      children:[
        {
          name:  '页面一',
          path: '/template/template01/a',
          // component:  ()=>import('@/pages/dynamic/index') //React.createElement(dComponent) ,
        },
        {
          name:  '页面二',
          path: '/template/template02/b',
          // component: React.createElement(dComponent),
        },
        {
          name:  '页面三',
          path: '/template/template03/c',
          // component: React.createElement(dComponent),
        },
        {
          name:  '页面四',
          path: '/template/template02/d',
          // component: React.createElement(dComponent),
        },
      ]
    })

    // console.log(menuList)

    return menuDataRender(menuList);
  };
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();

  return (
    <ProLayout
      logo={logo}
      formatMessage={formatMessage}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({ id: 'menu.home' }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      menuDataRender={menuDataRenderWrap}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized!.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
