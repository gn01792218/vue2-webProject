import req from'./Api'  //這個req可以自己命名

//使用時的範例，假設我們有一些與使用者相關的 API 好了，我們就可以把這個函式 import 進來，把 API 一支支地列出

//會員相關的API
//1.會員相關
export const getUserInfo = (userId) => {  //ok
  return req("get", `/api/Users/${userId}`)
}
export const editUserInfo =(userId,userObject)=>{ //userObject可以只傳入某個要修改的屬性就好
  return req("put",`/api/Users/${userId}`,userObject)
}
export const userLogIn = (logInData) => { //logInData內含帳密  
  return req("post", "/api/Users/signin", logInData)
}
export const userSignUp = (signUpData) => {  //註冊成功會直接回傳getUserInfo這支API
    return req("post", "/api/Users/signup", signUpData)
  }
export const editUserPassword = (userId,passWordObject) => { //passwordObject放入三個參數舊密碼 新密碼 確認新密碼
    return req("put", `/api/Users/${userId}/password`,passWordObject)
  }
export const deleteUserIcon = (userId) => {  //需要傳入產品媒體流水號+要刪除的圖片index，用Object傳過去就可以了
    return req("delete", `/api/users/${userId}/HeadShot`)
  }
export const userForgetPassword = (Forgetfrombody) => { //忘記帳密  
    return req("post", "/api/Users/forgotPassword", Forgetfrombody)
  }

  //會員的訂閱
  export const fllowedUser = (fllowFbody) => { //A訂閱B 
    return req("post", "/api/UserFollowers", fllowFbody)
  }
  export const getAfllow = (followUserId) => {  //查該會員訂閱了那些人
    return req("get", `/api/UserFollowers/${followUserId}/following`)
  }
  export const getAfllowed = (followedUserId) => {  //查該會員被那些人訂閱
    return req("get", `/api/UserFollowers/${followedUserId}/followers`)
  }
  export const getAfllowInfo = (UserId) => {  //查該會員被訂閱數、訂閱數
    return req("get", `/api/UserFollowers/${UserId}/SubscirbeNumbers`)
  }
  
  //產品媒體API-->創建產品時要先創建產品媒體的部分
  export const creatProductMedia = (MediafromForm) => {  //需要傳入fromForm
    return req("post", "/api/ProductMedias",MediafromForm)
  }
  export const getProductMedia = (productMediaId) => {  //需要傳入產品媒體流水號
    return req("get", `/api/ProductMedias/${productMediaId}`)
  }
  export const editProductMedia = (productMediaId,MediafromForm) => {  //需要傳入產品媒體流水號+要修改的fromForm物件(要刪除影片的話要在這裡用)
    return req("put", `/api/ProductMedias/${productMediaId}`,MediafromForm)
  }
  export const deleteProductMedia = (productMediaId,MediafromBody) => {  //需要傳入產品媒體流水號+要刪除的圖片index，用Object傳過去就可以了
    return req("put", `/api/ProductMedias/${productMediaId}/delete`,MediafromBody)
  }
  //產品API
  export const creatProduct = (ProductfromForm) => {  //需要傳入fromForm
    return req("post", "/api/products",ProductfromForm)
  }
  export const getProduct = (productId) => {  //需要傳入產品媒體流水號
    return req("get", `/api/Products/${productId}`)
  }
  export const getProductByKeyword = (keyword) => {  //需要傳入產品關鍵字
    return req("get", `/api​/Products​/search​/${keyword}`)
  }
  export const getProductBycategory = (category) => {  //需要傳入產品分類
    return req("get", `/api/Products/category/${category}`)
  }
  export const getProductByuserId = (userId) => {  //需要傳入某人Id
    return req("get", `/api/Products/users/${userId}`)
  }
  export const getAllProduct = () => {  //不需要任何參數，返回所有產品
    return req("get", "/api/Products/all")
  }
  export const editProduct = (productId,productfromForm) => {  //需要傳入產品流水號+要修改的fromForm物件(要刪除影片的話要在這裡用)
    return req("put", `api/Products/${productId}`,productfromForm)
  }
  export const deleteProductIcon = (productId) => {  //需要傳入產品流水號
    return req("delete", `/api/Products/${productId}/HeadShot`)
  }
  export const deleteProduct = (productId) => {  //需要傳入產品媒體流水號，該筆產品將整個刪除，包含所有產品連結都會被刪除
    return req("delete", `/api/Products/${productId}`)
  }
 //產品下方的留言
export const creatComments = (Commentsfrombody) => {  //傳入物件就好
  return req("post", "/api/ProductComments",Commentsfrombody)
}
export const getComments = (commentId) => {  //
  return req("get", `/api​/ProductComments​/${commentId}`)
}
export const getProductComments = (productId) => {  //取得某產品下的留言-->給產品展示頁使用
  return req("get", `/api/ProductComments/all/${productId}`)
}
export const getUserComments = (userId) => {  //取得某使用者 對所有產品的所有留言
  return req("get", `​/api​/ProductComments​/user​/${userId}`)
}
export const editComments = (commentId,commentfromFbody) => {  //需要傳入留言id和一個留言物件即可
  return req("put", `/api/ProductComments/${commentId}`,commentfromFbody)
}
export const deleteComment = (commentId) => {  
  return req("delete", `/api/ProductComments/${commentId}`)
}
//追蹤與被追蹤相關
//追蹤產品
export const userFllowerProduct = (ProductFollowersfrombody) => {  //點一次是追蹤，再點一次是不追蹤
  return req("post", "/api/ProductFollowers",ProductFollowersfrombody)
}
export const getUserFllowerProduct = (followUserId) => {  //取得該會員追蹤的所有產品
  return req("get", `/api/ProductFollowers/${followUserId}/following`)
}
export const getProductFllower = (followedProductId) => {  //取得收藏該產品的所有會員
  return req("get", `/api/ProductFollowers/${followedProductId}/followers`)
}
export const getProductFllowerInfo = (productFollowerId) => {  //取得該產品追蹤的所有會員
  return req("get", `/api/ProductFollowers/${productFollowerId}`,productId)
}
export const getProductFllowerCount = (followedProductId) => {  //取得該產品的被追蹤數
  return req("get", `/api/ProductFollowers/${followedProductId}/SubscirbeNumbers`)
}

//討論區
export const createDis = (disfrombody) => {  //點一次是追蹤，再點一次是不追蹤
  return req("post", "/api/Discusstions",disfrombody)
}
export const getDis = (discusstionId) => {  //取得某則討論
  return req("get", `/api/Discusstions/${discusstionId}`)
}
export const getDisByKeyword = (keyword) => {  //用關鍵字找討論
 return req("get",`/api/Discusstions/search/${keyword}`)
}
export const getDisBycategory = (category) => {  //用分類找討論
  return req("get", `/api/Discusstions/category/${category}`)
}
export const getDisByUser = (userId) => {  //取得該會員的所有發文
  return req("get",`/api/Discusstions/user/${userId}`)
}
export const getAllDis = () => {  //取得所有討論
  return req("get", "/api/Discusstions/all")
}
export const editDis = (discusstionId,edDisfromFbody) => {  //需要傳入留言id和一個留言物件即可
  return req("put", `/api/Discusstions/${discusstionId}`,edDisfromFbody)
}
export const deleteDis = (discusstionId) => {  
  return req("delete", `/api/Discusstions/${discusstionId}`)
}


//文章下方的留言
export const createDisComment = (disCommentfrombody) => {  //創造一則文章底下的留言
  return req("post", "/api/DiscusstionComments",disCommentfrombody)
}
export const getDisAllComment = (discusstionId) => {  //取得某文章下的所有討論
  return req("get", `/api/DiscusstionComments/all/${discusstionId}`)
}
export const getUserAllComment = (userId) => {  //取得某一會員對所有文章的評論
  return req("get", `/api/DiscusstionComments/user/${userId}`)
}
export const getComment = (discusstionCommentId) => {  //取得某一則留言
  return req("get", `​/api​/DiscusstionComments​/${discusstionCommentId}`)
}
export const editDisComment = (discusstionCommentId,edDisCommentfromFbody) => {  //需要傳入留言id和一個留言物件即可
  return req("put", `/api/DiscusstionComments/${discusstionCommentId}`,edDisCommentfromFbody)
}
export const deleteDisComment = (discusstionCommentId) => {  //刪除一則留言
  return req("delete", `/api/DiscusstionComments/${discusstionCommentId}`)
}

//追蹤文章
export const upvoat = (upvoatFromBody) => {  //點一次是追蹤，再點一次是不追蹤
  return req("post", "/api/DiscusstionFollowers",upvoatFromBody)
}
export const getDisFFllowerNum = (followedDiscusstionId) => {  //取得該文章的訂閱者人數
  return req("get", `/api/DiscusstionFollowers/${followedDiscusstionId}/SubscirbeNumbers`)
}
export const getUserFlloweDis = (followUserId) => {  //
  return req("get", `/api/DiscusstionFollowers/${followUserId}/following`)
}
export const getFlloweDisUserInfo = (followedDiscusstionId) => {  //取得該文章被那些人追蹤
  return req("get", `/api/DiscusstionFollowers/${followedDiscusstionId}/followers`)
}

//產品歷程，建立前一樣得先建立媒體櫃
export const creatProductHis = (pdHFromFrom) => {  //創建產品歷程，帶入fromData格式
  return req("post", "api/ProductHistories",pdHFromFrom)
}
export const getProductHis = (productHistoryId) => {  //取得某個歷程點
  return req("get", `/api/ProductHistories/${productHistoryId}`)
}
export const getProductAllHis = (productId) => {  //取得該產品的所有歷程
  return req("get", `/api/ProductHistories/all/${productId}`)
}
export const editPdHis = (productHistoryId,edPdHisfromForm) => {  //編輯歷程
  return req("put",`/api/ProductHistories/${productHistoryId}`,edPdHisfromForm)
}
export const deletePdHis = (productHistoryId) => {  //刪除歷程節點
  return req("delete", `/api/ProductHistories/${productHistoryId}`)
}
//產品歷程媒體櫃
export const creatProductHisMedia = (pdHMFromFrom) => {  //創建產品歷程媒體櫃，可以都是null唷
  return req("post", "/api/ProductHistoryMedias",pdHMFromFrom)
}
export const getProductHisMedia = (productHistoryMediaId) => {  //取得某個歷程點的媒體櫃
  return req("get", `/api/ProductHistoryMedias/${productHistoryMediaId}`)
}
///api​/ProductHistoryMedias​/${productHistoryMediaId}
export const editPdHisMida = (productHistoryMediaId,edPdHisfromForm) => {  //編輯歷程
  return req("put", `/api/ProductHistoryMedias/${productHistoryMediaId}`,edPdHisfromForm)
}
export const deletePdHisMedia = (productHistoryMediaId,MediaindexFromBody) => {  //需要傳入歷程媒體流水號+要刪除的圖片index，用Object傳過去就可以了
  return req("put", `/api/ProductHistoryMedias/${productHistoryMediaId}/delete`,MediaindexFromBody)
}








  
/*在元件中實際使用時的狀況
import { userLogIn } from "./user";

userLogIn()
  .then(res => {
    console.log("登入成功");
  })
  .catch(error => {
    // response攔截器會先執行，除非你漏接了，才會進到catch
  })
*/