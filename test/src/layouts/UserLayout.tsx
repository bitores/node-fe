import { MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { HelmetProvider } from 'react-helmet-async';
import { Link, useIntl, ConnectProps, connect } from 'umi';
import React from 'react';
import { ConnectState } from '@/models/connect';
import styles from './UserLayout.less';

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <div className={styles.container}>
        {/* <div className={styles.lang}>
          <SelectLang />
        </div> */}
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src="https://static.zmjx.com/manage/imgs/logo@2x.png" />
                <span className={styles.title}>运营管理后台</span>
              </Link>
            </div>
          </div>
          {children}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
