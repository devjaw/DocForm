<template>




<v-container>
<v-row justify="center">
        <v-col class="d-flex" cols="12" sm="6">
         <v-select
          :items="AllTemplates"
          item-text="name"
          item-value="id"
          label="Select Template"
          v-model="SelectedTemplate"
          v-on:change="GetTemplateVariables()"
          solo
        ></v-select>
      </v-col>
</v-row>

<v-row>
  <v-col>
    <v-card v-if="IsHidden">
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
          Export Document
          </v-card-title>
          <v-card-text>
            <v-flex>                                
              <div v-for="(item, index) in Variables" :key="item.name">

                <div v-if="item.InputId == 3">
                  <v-radio-group :label="item.name" v-model="item.value">
                    <!-- <div v-if="Data.variableid == item.id"> -->
                    <v-row >
                      <v-radio v-for="(Data) in item.InputVariablesData" :key="Data.id" :label="Data.text" :value="Data.id" >
                       
                      </v-radio>
                    </v-row>
                    <!-- </div> -->
                  </v-radio-group>
                </div>
                <div v-else-if="item.InputId == 4">
                  <v-select
                    :items="item.InputVariablesData"
                    item-text="text"
                    item-value="id"
                    :label="item.name"
                    v-model="item.value"
                    solo></v-select>
                </div>
                <div v-else-if="item.InputId == 1">
                  <v-text-field
                    :label="item.name"
                    :id="'input_' + index"
                    v-model="item.value"
                  ></v-text-field>
                </div>
                
              </div>
               
            </v-flex>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              v-on:click="SaveNewDocument()">
              Export
            </v-btn>
          </v-card-actions>
          </v-card>

  </v-col>
</v-row>
          


    <v-row v-if="IsHidden1">
      <v-col class="mb-4">
      
      <!-- <v-dialog
      v-model="dialog"
      width="500">
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" class="mx-2" color="primary">
              <v-icon dark>mdi-plus</v-icon>Add New Document
          </v-btn>
        </template>

        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title
          >
          Add New Document
          </v-card-title>
          <v-card-text>
            <v-flex>                                
              <div v-for="(item, index) in Variables" :key="item.name">

                <div v-if="item.InputId == 3">
                  <v-radio-group :label="item.name" v-model="item.value">
                    <div v-if="Data.variableid == item.id"> 
                    <v-row >
                      <v-radio v-for="(Data,i) in item.InputVariablesData" :key="i" :label="Data.text" ></v-radio>
                    </v-row>
                    </div> 
                  </v-radio-group>
                </div>
                <div v-else-if="item.InputId == 4">
                  <v-select
                    :items="item.InputVariablesData"
                    item-text="text"
                    item-value="id"
                    :label="item.name"
                    v-model="item.value"
                    solo></v-select>
                </div>
                <div v-else-if="item.InputId == 1">
                  <v-text-field
                    :label="item.name"
                    :id="'input_' + index"
                    v-model="item.value"
                  ></v-text-field>
                </div>
                




              </div>
               
            </v-flex>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              v-on:click="SaveNewDocument()">
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> -->


    <!-- <v-data-table  :headers="TableHeaders" :items="TableResult" item-key="id" class="elevation-1"> -->
          <!-- <template v-slot:item.action="{ item }">
          <v-icon small @click="DeleteTemplate(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table> -->

        
        <!-- <vuepdf v-bind:src="PdfData">
        <template slot="loading">
          loading content here...
        </template>
      </vuepdf> -->
       <!-- <object id="pdfviewer" v-bind:data="PdfData" type="application/pdf" style="width:100%;height:500px;"></object>
        <iframe id="pdfviewer2" v-bind:src="PdfData" type="application/pdf"  width="100%" height="500px">
        </iframe> -->
        
            <!-- <v-btn
            color="primary"
            text
            v-on:click="$refs.myPdfComponent.print()">
            print
          </v-btn> -->


        <!-- <vue-pdf ref="myPdfComponent" v-bind:src="PdfData"></vue-pdf>
      <div v-if="ShowPDF">
        <object :url="PdfData" width="870" height="790" type="application/pdf">
          <p>This browser does not support PDFs. Please open the PDF to view it: <a :href="url" target="_blank">Open PDF</a>.</p>
      </object>
      </div> -->

      </v-col>
    </v-row>

  </v-container>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/docxtemplater/3.17.6/docxtemplater.js"></script>
<script src="https://unpkg.com/pizzip@3.0.6/dist/pizzip.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js"></script>
<script src="https://unpkg.com/pizzip@3.0.6/dist/pizzip-utils.js"></script>
<script>
const electron = require("electron");
const ipc = electron.ipcRenderer;
var Docxtemplater = require('docxtemplater');
var PizZip = require('pizzip');
import PizZipUtils from "pizzip/utils/index.js";
var FileSaver = require('file-saver');
export default {
    name: 'HelloWorld',
    created() {
        this.GetAllTemplates();
        const BrowserWindow = electron.remote.BrowserWindow;
    },
    data: () => ({
      dialog:false,
       counter:0,
       IsHidden:false,
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader',
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
      importantLinks: [
        {
          text: 'Documentation',
          href: 'https://vuetifyjs.com',
        },
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com',
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuejs.com/vuetify',
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs',
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify',
        },
      ],
      whatsNext: [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com/components/api-explorer',
        },
        {
          text: 'Select a layout',
          href: 'https://vuetifyjs.com/layout/pre-defined',
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
        },
      ],
      AllTemplates:[],
      SelectedTemplate: 0,
      TableHeaders:[],
      TableResult:[],
      Variables:[],
      InputData :[],
      PdfData:undefined,
      ShowPDF:false,
      InputValueData : [],
      IsHidden1:false,
    }),
    methods: {
      exportDoc:function(){
        ipc.send('ExportDoc', this.Variables);
      },
      GetAllTemplates:function(){
          var res=  ipc.sendSync('GetAllTemplates')
          console.log(res)
          this.AllTemplates = [];
          this.AllTemplates = res;
          //console.log(this.TableResult)
      },
      GetTemplateVariables:function(){
        this.TableHeaders = []
        this.TableResult = []
        console.log(this.SelectedTemplate)
        var res=  ipc.sendSync('GetTemplateVariablesWithInputData',this.SelectedTemplate)
        console.log('GetTemplateVariablesWithInputData')
        console.log(res)
        //var HeaderArray =[];
        // var ObjHeader = Object.keys(res.TemplateData[0]);
        // var Item;
        // ObjHeader.forEach(element => {
        //   Item = {
        //      text: element, value: element
        //   }
          //HeaderArray.push(Item);
        //});
        res.TemplateData.forEach(re=>{
          console.log(re);
          this.Variables.push(re)
        })
        //this.InputValueData = res.InputData;
        //console.log(HeaderArray)
        //this.TableHeaders = HeaderArray
        //this.TableResult = res
        this.IsHidden = true;
        
      },
      SaveNewDocument:function(){
        var DocInfo = []
        var DocVariables = []
        DocInfo.push({TemplateId : this.SelectedTemplate})

        //update InputValue
        console.log(this.Variables)
        this.Variables.forEach(Input => {
          console.log(Input)
          if(Input.InputId == 3 || Input.InputId == 4){
            console.log(Input.value)
            Input.value = Input.InputVariablesData.find(data => data.id == Input.value).text;
          }
          var CurrentInput = {
            key : Input.name,
            value : Input.value
          }
           DocVariables.push(CurrentInput)
        });
        DocInfo.push(DocVariables)
        var res=  ipc.sendSync('GenerateDoc',DocInfo)
      },
      
    }
  }


  function loadFile(url,callback){
    console.log('hi')
        PizZipUtils.getBinaryContent(url,callback);
    }
    function generate() {
        loadFile("C:\Users\USER\Downloads\tag-example (1).docx",function(error,content){
            if (error) { throw error }

            // The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
            function replaceErrors(key, value) {
                if (value instanceof Error) {
                    return Object.getOwnPropertyNames(value).reduce(function(error, key) {
                        error[key] = value[key];
                        return error;
                    }, {});
                }
                return value;
            }

            function errorHandler(error) {
                console.log(JSON.stringify({error: error}, replaceErrors));

                if (error.properties && error.properties.errors instanceof Array) {
                    const errorMessages = error.properties.errors.map(function (error) {
                        return error.properties.explanation;
                    }).join("\n");
                    console.log('errorMessages', errorMessages);
                    // errorMessages is a humanly readable message looking like this :
                    // 'The tag beginning with "foobar" is unopened'
                }
                throw error;
            }
            console.log('hi2')
            var zip = new PizZip(content);
            var doc;
            try {
                doc = new Docxtemplater(zip);
            } catch(error) {
                // Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
                errorHandler(error);
            }
            console.log('hi3')
            doc.setData({
                first_name: 'test',
                last_name: 'Doe',
                phone: '0652455478',
                description: 'New Website'
            });
            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render();
            }
            catch (error) {
              console.log(error)
                // Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
                errorHandler(error);
            }
            console.log('hi4')
            var out=doc.getZip().generate({
                type:"blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }) //Output the document using Data-URI
            FileSaver.saveAs(out,"output.docx")
        })
    }
</script>
