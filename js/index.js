const BtnClear = document.getElementById('btnClear')
const CntSales = document.getElementById('cntSales')
const BtnAddSale = document.getElementById('btnAddSale')
const BtnSendInformation = document.getElementById('btnSendInformation')

const DateOfSale = document.getElementById('dateOfSale')
const Product = document.getElementById('product')
const Price = document.getElementById('price')
const Quantity = document.getElementById('quantity')

const EXECUTION_VERSION = 'Development'

/* Functions */
const takeData = () => {
  let status = true

  if (DateOfSale.value === '' || Product.value === '' || Price.value === '' || Quantity.value === '') status = false

  if (!status) alert('Le falto cargar algun dato')

  const productToSale = {
    dateSale: DateOfSale.value,
    nameProduct: Product.value,
    price: Price.value,
    quantity: Quantity.value
  }

  return {
    productToSale,
    status
  }
}

const addProductToLocalStorage = (productToSale) => {
  const productsInLocalStorage = localStorage.getItem('productsLubricentro')

  let products = productsInLocalStorage ? JSON.parse(productsInLocalStorage) : []

  products.push(productToSale)

  localStorage.setItem('productsLubricentro', JSON.stringify(products))
}

const updateProductList = () => {
  const productsInLocalStorage = localStorage.getItem('productsLubricentro')

  let products = productsInLocalStorage ? JSON.parse(productsInLocalStorage) : []

  products.forEach(product => {
    console.log(product.nameProduct);
    let data = `${product.dateSale} //// ${product.nameProduct}  --//--  ${product.price}  --//--  ${product.quantity}`

    const newSaleP = document.createElement('p')
    newSaleP.classList.add('sale')
    newSaleP.textContent = data

    CntSales.appendChild(newSaleP)
  })
}
/* Functions */


/* Events */
BtnClear.addEventListener('click', () => {
  CntSales.innerHTML = ''
  localStorage.removeItem('productsLubricentro');
})

BtnAddSale.addEventListener('click', () => {
  const newSaleP = document.createElement('p')
  let dataSale = takeData()

  addProductToLocalStorage(dataSale.productToSale)

  if (dataSale.status) {
    newSaleP.classList.add('sale')

    let data = `${dataSale.productToSale.dateSale} //// ${dataSale.productToSale.nameProduct}  --//--  ${dataSale.productToSale.price}  --//--  ${dataSale.productToSale.quantity}`

    newSaleP.textContent = data

    CntSales.appendChild(newSaleP)
  }

  Product.value = ''
  Price.value = ''
  Quantity.value = ''
})

BtnSendInformation.addEventListener('click', async () => {
  const productosGuardados = localStorage.getItem('productsLubricentro')

  let products =  productosGuardados ? JSON.parse(productosGuardados) : []

  let protocol = EXECUTION_VERSION === 'Development' ? 'http://' : 'https://'
  let source = EXECUTION_VERSION === 'Development' ? 'localhost:3002' : 'pjstech.online'
  
  let APIRoute = `${protocol}${source}/lubricentro`

  const Request = await fetch(APIRoute, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(products)
  })

  const Response = await Request.json()

  if (Response.message === 'I send the sales information of the day') alert('Informacion enviada correctamente')
  else alert('Se produjo un error en el envio de las ventas del dia')
})

window.addEventListener('load', function() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  DateOfSale.value = `${year}-${month}-${day}`

  updateProductList()
})
/* Events */
