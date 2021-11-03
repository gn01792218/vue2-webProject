// api.js
import axios from "axios";
const localdev='/api';  //開發時使用
const webApi='http://34.80.165.225'; //上傳雲端時使用
// baseURL是你API的主要Domain，之後發請求時只要填相對路徑就可以了
const instance = axios.create({
  baseURL:webApi,
  headers: { 'Content-Type': 'application/json'},
  timeout: 20000
});
// 請求攔截器:
// 此處的instance為我們create的實體
instance.interceptors.request.use(
    function (config) {
      // 在送出 request 前做些啥事
      return config;
    },
    function (error) {
      // 在請求錯誤時做些啥事
      return Promise.reject(error);
    }
  );
//回應攔截器
// 此處的instance為我們create的實體
instance.interceptors.response.use(
    function (response) {
      //對回應的data做些啥事 Do something with respnnse data
      return response;
    },
    function (error) {  //重點部分:處理回應時的邏輯
      if (error.response){
        switch (error.response.status) {
          case 404:
            console.log("你要找的頁面不存在")
            // go to 404 page
            break
          case 500:
            console.log("程式發生問題")
            // go to 500 page
            break
          default:
            console.log(error.message)
        }
      } 
      if (!window.navigator.onLine) {
        alert("網路出了點問題，請重新連線後重整網頁");
        return;
      }
      return Promise.reject(error);
    }
  );

  //封裝
  //這樣就可以透過判斷參數來回傳相對應的 method
export default function(method, url, data = null, config) {
    method = method.toLowerCase();
    switch (method) {
      case "post":
        return instance.post(url, data, config);
      case "get":
        return instance.get(url, { params: data });
      case "delete":
        return instance.delete(url, { params: data });
      case "put":
        return instance.put(url, data);
      case "patch":
        return instance.patch(url, data);
      default:
        console.log(`未知的 method: ${method}`);
        return false;
    }
  }




