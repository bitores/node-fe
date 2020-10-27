import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = ProSettings & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  // layout: 'sidemenu',
  layout: 'topmenu',
  contentWidth: 'Fluid',//'Fixed',//
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: true,
  menu: {
    locale: false,
  },
  title: '前端中台',
  pwa: false,
  iconfontUrl: '',
  // openKeys:['/sys/xxx']
};

export type { DefaultSettings };

export default proSettings;
