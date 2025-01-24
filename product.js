function truncatewords(str,numWords){
    const words= str.split('');
    if(words.length<=numWords){
        return str;
    }
    return words.slice(0,numWords).join('')+'...';
}
function normalizeCategory(category) {
    return category.toLowerCase().replace(/['\s]+/g, '-');
}

fetch("https://fakestoreapi.com/products")
.then((response)=>{ return response.json()})
.then((data)=>{
    const productData=data;


   const containerCards = productData.map((product)=>{
        console.log(product)
        const truncateDescription=truncatewords(product.description,92);
        const truncateTitle=truncatewords(product.title,13);
        const normalizedCategory = normalizeCategory(product.category);
        return(
            `
            <div class= "productCard ${normalizedCategory}">
                <img src=${product.image} alt=${product.name}>
                <p class="title">${truncateTitle}</p>
                <p class="description">${truncateDescription}</p>
                <hr>
                <i class="bi bi-currency-dollar dollars"></i>
                <pre class="price">${product.price}</pre>
                <hr class="horr">
                <button class="details">Details</button>
                <button class="addcart">Add to Cart</button>

            </div>
            
            
            `
        )  
    })
    
    const container = document.getElementById('container');
    container.innerHTML = containerCards.join(' ');
}).catch((error)=>{
    console.log(error)
    
}
)
function filteritems(category){
    const items=document.querySelectorAll('.productCard');
    items.forEach(item=>{
        if(category==='all'||item.classList.contains(category)){
            item.style.display='block';
        }
        else{
            item.style.display='none';
        }
    });
}