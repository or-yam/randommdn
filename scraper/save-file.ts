import fs from 'fs';

export const saveToJsonFile = (dataObject: any[] | {}, fileName: string) => {
  const asJson = JSON.stringify(dataObject, null, 2);
  fs.writeFile(`${fileName}.json`, asJson, error => {
    if (error) throw error;
    console.log('Data written to file');
  });
};
