const token = "L2P2dK5OCgXMDQ5ZKzrDxEkY8P92";
const api_path = "myjshomework";
const viewOrder = document.getElementById("viewOrder"); //訂單表單
const clearAll = document.getElementById("clearAll"); //刪除全部訂單按鈕
let orders = [];

// 監聽刪除全部表單按鈕
clearAll.addEventListener("click", function(e) {
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`,{
        headers:{
            'Authorization':token,
        }
    }).then(function(response){
        // 重新繪製訂單畫面
        getOrder();
    });
})
// 監聽刪除單一訂單按鈕
viewOrder.addEventListener('click', function(e){
    if(e.target.nodeName == "A"){
        let orderId = e.target.id;
        axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders/${orderId}`,{
            headers:{
                'Authorization':token,
            }
        }).then(function(response){
            getOrder();
        });
    }
});

// 取得客戶訂單資訊
function getOrder(){
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${api_path}/orders`,{
        headers:{
            'Authorization': token,
        }
    }).
    then(function(response){
        // 執行渲染畫面
        orders = response.data.orders;
        randomOrder();
        randomDount();
    });
}


// 繪製圓餅圖
function randomDount(){
    let productOrder = {};
    let dountOrder=[];
    orders.forEach(function(item){
        item.products.forEach(function(item){
            if(productOrder[item.category] == undefined){
                productOrder[item.category] = 1;
            }else{
                productOrder[item.category] +=1;
            }
        });
    });
    // 將資料轉為陣列
    let orderAry = Object.keys(productOrder).forEach(function(item){
        dountOrder.push([item,productOrder[item]]);
    });
    let chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: dountOrder,
          type:"pie",
          colors:{
              "窗簾":"#5434A7",
              "床架":"#DACBFF",
              "收納":"#9D7FEA"
          }
        }
    });
}
// 繪製訂單表格
function randomOrder(){
    let str = "";
    let productOrder ="";
    orders.forEach(function(item){
        //  將訂單產品資訊撈出
        item.products.forEach(function(item){
            productOrder += `${item.title}</br>`
        });
        str += `<tr>
        <td>${item.createdAt}</td>
        <td>${item.user.name}</br>${item.user.tel}</td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>${productOrder}</td>
        <td>${item.date}</td>
        <td>未處理</td>
        <td><a href="#" class="text-decoration-none btn btn-danger" id="${item.id}">刪除</a></td>
      </tr>`;
      productOrder ="";
    })
    viewOrder.innerHTML = str;
}


window.onload = getOrder;