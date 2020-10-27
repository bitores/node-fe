import { Button, message, notification } from 'antd';

import React from 'react';
import { useIntl } from 'umi';
import request from '@/utils/request';
import defaultSettings from '../config/defaultSettings';
import BJ_REPORT from 'badjs-report';

request('/isLogin').then(res=>{})
console.log(BJ_REPORT)

BJ_REPORT.init({
  id: 1,                                // 上报 id, 不指定 id 将不上报
  uin: 123,                             // 指定用户 id, (默认已经读取 qq uin)
  delay: 1000,                          // 当 combo 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
  url: "/tool/badjs",         // 指定上报地址
  ignore: [/Script error/i],            // 忽略某个错误
  random: 1,                            // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
  repeat: 5,                            // 重复上报次数(对于同一个错误超过多少次不上报)
                                        // 避免出现单个用户同一错误上报过多的情况
  onReport: function(id, errObj){
    console.log(errObj)
  },     // 当上报的时候回调。 id: 上报的 id, errObj: 错误的对象
  submit:request,                               // 覆盖原来的上报方式，可以自行修改为 post 上报等
  ext: {},                               // 扩展属性，后端做扩展处理属性。例如：存在 msid 就会分发到 monitor,
  offlineLog : false,                    // 是否启离线日志 [默认 false]
  offlineLogExp : 5,                    // 离线有效时间，默认最近5天
});


// 天气预报 start
function getLocation() {
  if (navigator.geolocation) {
    // debugger
      navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position)
        localStorage.geolocationInfo = "success"
        localStorage.geolocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
      },error=>{
        console.error(error)
      },{
        enableHighAccuracy: false,//是否要求高精度的地理位置信息
        timeout: 10000,//对地理位置信息的获取操作做超时限制，如果再该事件内未获取到地理位置信息，将返回错误
        maximumAge:60*1000//设置缓存有效时间，在该时间段内，获取的地理位置信息还是设置此时间段之前的那次获得的信息，超过这段时间缓存的位置信息会被废弃
      });
  } else {
      localStorage.geolocationInfo = "fail"
  }
}
// getLocation();
// 天气预报 end


const { pwa } = defaultSettings;

// if pwa is true
if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    message.warning(useIntl().formatMessage({ id: 'app.pwa.offline' }));
  });

  // Pop up a prompt on the page asking the user if they want to use the latest version
  window.addEventListener('sw.updated', (event: Event) => {
    const e = event as CustomEvent;
    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;
      if (!worker) {
        return true;
      }
      // Send skip-waiting event to waiting SW with MessageChannel
      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (msgEvent) => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };
        worker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
      });
      // Refresh current page to use the updated HTML and other assets after SW has skiped waiting
      window.location.reload(true);
      return true;
    };
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.close(key);
          reloadSW();
        }}
      >
        {useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated.ok' })}
      </Button>
    );
    notification.open({
      message: useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated' }),
      description: useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated.hint' }),
      btn,
      key,
      onClose: async () => {},
    });
  });
} else if ('serviceWorker' in navigator) {
  // unregister service worker
  const { serviceWorker } = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then((sws) => {
      sws.forEach((sw) => {
        sw.unregister();
      });
    });
  }
  serviceWorker.getRegistration().then((sw) => {
    if (sw) sw.unregister();
  });

  // remove all caches
  if (window.caches && window.caches.keys) {
    caches.keys().then((keys) => {
      keys.forEach((key) => {
        caches.delete(key);
      });
    });
  }
}
