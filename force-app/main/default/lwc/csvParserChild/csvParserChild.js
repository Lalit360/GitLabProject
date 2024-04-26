import { LightningElement, wire, api, track } from 'lwc';

export default class CsvParserChild extends LightningElement {
    @api sobjectDetails;
    fileData;
    isTableVisibleChild = false;
    fileLineData = [];
    fileHeader = [];

    openfileUpload(event) {
        this.handleClear();
        const file = event.target.files[0];
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'mimeType': file.type
            }
        }
        reader.readAsDataURL(file)
        this.read(file);
    }
    thisMethod(){
      console.log('THIS Is THE NEW PHASE');
    }

    async read(file) {
        try {
          const result = await this.load(file);
          this.csvParse(result);
        } catch (error) {
          this.dispatchEvent(
            this.showToastPopup('Error', error, 'error')
        );
        }
      }
    async load(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
    
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = () => {
            reject(reader.error);
          };
          reader.readAsText(file);
        });
      }
      csvParse(csv){
        if (this.fileData.filename.split('.').pop()=='csv') {
          const lines = csv.split(/\r\n|\n/);
          this.fileHeader = lines[0].split(',');
          for (let index = 1; index < lines.length-1; index++) {
              const element = lines[index].split(',');
              if (element) {
                  this.fileLineData.push(element);
              }
          }
          this.isTableVisibleChild = true;
        }
    }
    handleClear(){
    this.fileData = {};
    this.fileLineData = [];
    this.fileHeader = [];
    this.isTableVisibleChild = false;
    }
}