/*
* Written by adeel.maliks20@gmail.com
* Licence MIT
*/

const YOUR_LW_TOKEN = "INSERT YOUR LW TOKEN HERE"

function getLWStockItems() {
let allProducts = []
const URL = 'https://eu-ext.linnworks.net/api/Stock/GetStockItemsFull'
let startingPageNo = 1

  do {
    const payload = {
      'keyword': '',
      'loadCompositeParents': 'True',
      'loadVariationParents': 'False',
      'entriesPerPage': '200',
      'pageNumber': startingPageNo,
      'dataRequirements': '[0,1,2,3,7,8]',
      'searchTypes': '[0,1,2]'
    }
    console.log(payload.pageNumber)
    var response = UrlFetchApp.fetch(URL, {
      method: 'post',
      headers: {
        'Authorization': YOUR_LW_TOKEN
      },
      'contentType': 'application/json',
      'payload': JSON.stringify(payload),
      muteHttpExceptions: true
    })
    console.log(response.getResponseCode())
    if (response.getResponseCode() === 200){
    const jsonRes = JSON.parse(response.getContentText())
    allProducts = allProducts.concat(jsonRes)
    startingPageNo++
    }
  } while (response.getResponseCode() !== 400)
console.log(allProducts.length)
return allProducts
}

function parseResponse(){
  const stocksData = getLWStockItems()
  const stockItemsToWrite = []
  try{
  for (let item of stocksData){
    const suppliersData = item.Suppliers
    const itemProperties = item.ItemExtendedProperties
    const images = item.Images
    const stockLev = item.StockLevels
    let imageLink = ""
    let itemsObj = {}
    let supplierObj = {}
    for (let supplier of suppliersData){
      if(supplier.IsDefault){
        supplierObj["supplierName"] = supplier.Supplier
        supplierObj["supplierCode"] = supplier.Code
        supplierObj["supplierBarcode"] = supplier.SupplierBarcode
        supplierObj["supplierPP"] = supplier.PurchasePrice
      }
    }
    for (let property of itemProperties){
      if(property.ProperyName === "export-two-tone"
      || property.ProperyName === "export-postage"
      || property.ProperyName === "HSTariffCode"
      || property.ProperyName === "CountryOfOrigin"
      || property.ProperyName === "ShippingDescription"
      || property.ProperyName === "CountryOfOriginISO"
      ){
        itemsObj[property.ProperyName] = property.PropertyValue
      }
    }

    for (let image of images){
      if(image.IsMain){
        imageLink = image.FullSource
      }
    }

    for (let stock of stockLev){
      if(stock.Location.LocationName === "Default"){
        var availableStock = stock.Available
      }
    }
  stockItemsToWrite.push([
    item.ItemNumber,
    item.ItemTitle,
    item.BarcodeNumber,
    item.CategoryName,
    item.PurchasePrice,
    item.RetailPrice,
    supplierObj["supplierName"],
    supplierObj["supplierCode"],
    supplierObj["supplierBarcode"],
    supplierObj["supplierPP"],
    itemsObj['CountryOfOrigin'],
    itemsObj['CountryOfOriginISO'],
    itemsObj['export-postage'],
    itemsObj['export-two-tone'],
    itemsObj['HSTariffCode'],
    itemsObj['ShippingDescription'],
    item.PackageGroupName,
    imageLink,
    availableStock
  ])
  itemsObj = {}
  supplierObj = {}
  imageLink = ""
  }
  }catch(erorr){
    console.log("some error while parsing: ", erorr)
  }
  writeToSheet(stockItemsToWrite, "Sheet1")
}

function writeToSheet(data, sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)
  try {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clear({ formatOnly: true, contentsOnly: true })
  } catch (error) {
    console.log(error)
  }
  sheet.getRange(2, 1, data.length, data[0].length).setValues(data)
}
