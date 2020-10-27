// const LiveMedia = require();
import LiveMedia from '@/plugins/live-media'
import ChalkTalk from '@/plugins/chalktalk'

// console.log('==',LiveMedia)
export default [
  {
    name: 'live-media',
    module: LiveMedia,
    enable: true,
  },
  {
    name: 'chalkTalk',
    module: ChalkTalk,
    enable: true,
  },

]