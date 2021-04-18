const api_path = "myjshomework";
const token = "";

let datas = [];
let cartsData = [];

const listProducts = document.getElementById("listProducts"); //產品列表
const chartList = document.getElementById("chartList"); //購物車
const searchList = document.getElementById("searchList"); //收尋列表
const deleteAll = document.getElementById("deleteAll"); //刪除所有商品按鈕
const sendOrder = document.getElementById("sendOrder");  //送出訂單按鈕
const allTotal = document.getElementById("allTotal");//購物車總金額
// 訂單資訊
const inputName = document.getElementById("inputName");
const inputPhone = document.getElementById("inputPhone");
const inputMail = document.getElementById("inputMail");
const inputAddress = document.getElementById("inputAddress");
const paySelect = document.getElementById("paySelect");

// 監聽新增購物車按鈕
listProducts.addEventListener('click', function(e){
    if(e.target.getAttribute('class')=='addCart'){
        let data = {};
        data.id = e.target.id;
        data.quantity = 1;
        addCartItem(data);
    }
});
// 監聽收尋商品列表
searchList.addEventListener('change',function(){
    searchProduct();
});
// 監聽刪除所有按鈕
deleteAll.addEventListener('click',function(){
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`).
    then(function(response){
        // 更新購物車
        getCartList();
    });
});
// 監聽刪除單項產品按鈕
chartList.addEventListener('click',function(e){
    if(e.target.getAttribute('class') == 'pt-5 btn btn-danger'){
        let productId = e.target.id;
        axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts/${productId}`).
        then(function(response){
            // 更新購物車
            getCartList();
        });
    }
});
// 監聽送出訂單按鈕
sendOrder.addEventListener('click', function(){
    if(inputName.value == "" || inputPhone.value=="" || inputMail.value=="" || inputAddress.value =="" || paySelect.value==""){
        alert("訂單資訊錯誤請填寫正確");
    }
    let user = {};
    user.name = inputName.value;
    user.tel = inputPhone.value;
    user.email = inputMail.value;
    user.address = inputAddress.value;
    user.payment = paySelect.value;
    axios.post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/orders`,{
        data:{
            user
        }
    }).
    then(function(response){
        console.log(response);
    })
});


// 請求伺服器端資料
function init(){
    getProductList();
    getCartList();    
}
// 取得產品列表
function getProductList(){
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/products`)
    .then(function(response){
        datas = response.data.products;
        // 執行繪製產品列畫面
        randomListProducts(datas);
    })
}
// 搜尋產品列表
function searchProduct(){
    let searchData = [];
    datas.forEach(function(item){
        if(searchList.value == item.category){
            searchData.push(item);
        } else if(searchList.value == ""){
            searchData = datas;
        }
    });
    randomListProducts(searchData); //繪製收尋後產品列表
}
// 取得購物車列表
function getCartList(){
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`)
    .then(function(response){
        cartsData = response.data.carts;
        // 執行購物車畫面繪製
        randomListCart();
    });
}
// 新增購物車
function addCartItem(data){
    axios.post(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/${api_path}/carts`,{
        "data":{
            "productId": data.id,
            "quantity": data.quantity
        }
    }).then(function(response){
        console.log(response)
        getCartList();
    });
}

// 繪製產品列表
function randomListProducts(data){
    let str = "";
    data.forEach(function(item){
        str += `<li class="col-3 position-relative mb-3">
        <h5 class="bg-dark text-light px-3 py-2 position-absolute newProduct">新品</h5>
        <img src="${item.images}" alt="">
        <a class="bg-dark text-center text-light text-decoration-none d-block btn py-2"><h5 class="addCart" id="${item.id}">新增購物車</h5></a>
        <h5>${item.title}</h5>
        <h5 class="text-dark2"><del>$${item.origin_price}</del></h5>
        <h3>NT$${item.price}</h3>
    </li>`
    });
    listProducts.innerHTML = str;
}

// 繪製購物車列表
function randomListCart(){
    let str = "";
    let total = 0;
    cartsData.forEach(function(item){
        str +=`<tr class="h5">
        <th><img src="${item.product.images}" style="width:80px ;height:80px" alt=""></th>
        <td class="pt-5">${item.product.title}</td>
        <td class="pt-5">NT$${item.product.price}</td>
        <td class="pt-5">${item.quantity}</td>
        <td class="pt-5">NT$${item.quantity*item.product.price}</td>
        <td class="pt-5 btn btn-danger" id="${item.id}"><i class="fas fa-times h3"></i></td>
      </tr>`;
      total += item.product.price; //計算總金額
    });
      chartList.innerHTML = str;
      allTotal.textContent = total;
}

window.onload = init;