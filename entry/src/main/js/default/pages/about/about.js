import router from '@system.router';

export default {
  data: {},
  onInit() {},
  onBack(){
    router.replace({uri: "/pages/index/index"});
  }
}
