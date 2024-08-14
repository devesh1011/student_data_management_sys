const xlsx = require('xlsx');

function parseExcelFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheet_name_list = workbook.SheetNames;
  const xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  return xlData;
}

module.exports = {
  parseExcelFile,
};