# Get All Linnworks (LW) Stock Items To Google Spreadsheet

This script is written in Google Apps Script and utilizes [GETStockItemsFull](https://apps.linnworks.net//Api/Method/Stock-GetStockItemsFull) API endpoint to get everything about stock items.

## Things needed for this script work
1. LW API token which you can get following the [instructions here](https://help.linnworks.com/support/solutions/articles/7000043829-authorization-api-token)
2. Google Workspace account

## How to run the script?
1. Create a sheet by writing sheet.new in browser
2. In your new spreadsheet, navigate to Tools > Script Editor. 
3. Copy paste the code from here to the script editor
4. Insert your LW API token `YOUR_LW_TOKEN ` variable
5. Run parseResponse() function, authorize and you should be able to see LW stocks data in your spreadsheet
