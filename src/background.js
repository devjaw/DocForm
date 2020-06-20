'use strict'

import { app, protocol, BrowserWindow,ipcMain } from 'electron'
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
import { captureRejectionSymbol } from 'events'
const isDevelopment = process.env.NODE_ENV !== 'production'
var path = require('path');
var model = require('../src/db/model.js');

//const model = require(path.join(__dirname, '../src/db/', 'model.js'))
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600, webPreferences: {
    nodeIntegration: true
  } })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    

    createWindow()
  }
})



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }

  //   model.initDb(app.getPath('userData'),
  // )

  createWindow()
  model.createDb()

  // const win = new PDFWindow({
  //   width: 800,
  //   height: 600
  // })

  // win.loadURL('http://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}



//IPC main

ipcMain.on('test2', (event, arg) => {
//console.log(arg)
event.returnValue = 'return string'
})

ipcMain.on('findParameters', (event, arg) => {
  var Docxtemplater = require('docxtemplater');
   var PizZip = require('pizzip');

  var fs = require('fs');
  var path = require('path');

  //Load the docx file as a binary
  var content = fs
      .readFileSync(path.resolve(__dirname, '../doc/tag-example.docx'), 'binary');

  var zip = new PizZip(content);

  //var doc = new Docxtemplater();
  //doc.loadZip(zip);

  //var doc = new Docxtemplater(content);
  //var keys = Object.keys(doc.templatedFiles);
  //console.log(keys)

  var InspectModule = require("docxtemplater/js/inspect-module");
  var iModule = InspectModule();
  const doc = new Docxtemplater(zip, { modules: [iModule] });
  doc.render();
  var tags = iModule.getAllTags();
  //console.log(tags);

  event.returnValue = tags
})




ipcMain.on('ExportDoc', (event, arg) => {


var Data = arg;
console.log(Data)
var Docxtemplater = require('docxtemplater');
var PizZip = require('pizzip');

var fs = require('fs');
var path = require('path');

//Load the docx file as a binary
var content = fs
    .readFileSync(path.resolve(__dirname, '../doc/tag-example.docx'), 'binary');

var zip = new PizZip(content);
var doc = new Docxtemplater();
doc.loadZip(zip);
  
var DataObject = {};
Data.forEach(element => {
  DataObject[element.key] = element.value;
});
  
doc.setData(
  DataObject
);
try {
  doc.render()
}
catch (error) {
  var e = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      properties: error.properties,
  }
  console.log(JSON.stringify({error: e}));
  throw error;
}
  
var buf = doc.getZip().generate({type: 'nodebuffer'});
  
fs.writeFileSync(path.resolve(__dirname, '../output.docx'), buf);


event.returnValue = "Done"
})

ipcMain.on("SaveNewTemplate",(event, arg) => {
 
  // var name = arg.name
  // var path = arg.path

  model.SaveNewTemplate(arg)
  event.returnValue = "done";

})

ipcMain.on("GetAllTemplates",async (event, arg) => {
  await model.GetAllTemplates().then(res=>{
    event.returnValue = res;
  });
})

ipcMain.on("DeleteTemplate",async (event, arg) => {

  await model.DeleteTemplate(arg).then(res=>{
    console.log(res);
    console.log('res');
    event.returnValue = res;
  });
});
ipcMain.on("GetTemplateVariables",async (event, arg) => {
  event.returnValue = await model.GetTemplateVariables(arg)
});
ipcMain.on("GetTemplateVariablesWithInputData",async (event, arg) => {
  await model.GetTemplateVariables(arg).then(res=>{
    var TemplateWithInput = {
      TemplateData : res
    }
    console.log(res);
    var VariableIds = [];
    for (var i = 0; i < res.length; i++) {
      VariableIds.push(res[i].id)
    }
    model.GetAllVariablesInputValues(VariableIds).then(res2=>{
      
      TemplateWithInput.TemplateData.forEach(temp => {
        temp.InputVariablesData = []
        console.log(temp)
        res2.forEach (varData =>{
          console.log(varData)
          if(temp.id === varData.variableid){
            temp.InputVariablesData.push(varData)
          }
        })
      });
      TemplateWithInput.InputData = res2
      console.log(res2)

      event.returnValue = TemplateWithInput
    });
    
  })
});

ipcMain.on("GenerateDoc",async (event, arg) => {
  console.log(arg)
  var TemplateId = arg[0].TemplateId
  console.log(TemplateId)
  var DocVariables = arg[1]
  console.log(DocVariables)

  var VariablesObject = {};
  arg[1].forEach(element => {
    VariablesObject[element.key] = element.value;
  });


  await model.GetTemplatePath(TemplateId).then(res=>{
    console.log(res);

    (async () => {
      const value = await RenderDoc(res[0].path,VariablesObject).then((buff)=>{
        console.log('buff')
        console.log(buff)
        var int8view = new Uint8Array(buff);
        console.log(int8view)
        var a = [];
        a.push(buff)
        event.returnValue = int8view;
      })
    })()


    
    
    
  });
  // await model.GetTemplateVariables(arg).then(res=>{
  //   console.log(res)
  //   event.returnValue = res;
  // });
});

ipcMain.on("AddNewTextValueFun",async(event, arg) => {
  console.log(arg);
  await model.AddNewTextValueFun(arg)
  .then(res=>{
    console.log(res)
    event.returnValue = res;
  });
});

ipcMain.on("GetInputTextValue",async(event, arg) => {
  console.log(arg);
  await model.GetInputTextValue(arg)
  .then(res=>{
    console.log(res)
    event.returnValue = res;
  });
})

ipcMain.on("GetAllVariablesValues",async(event, arg) => {
  console.log(arg);
  await model.GetAllVariablesValues(arg)
  .then(res=>{
    console.log(res)
    event.returnValue = res;
  });
})

ipcMain.on("DeleteVariableInput",async(event, arg) => {
  console.log(arg);
  await model.DeleteVariableInput(arg)
  .then(res=>{
    console.log(res)
    event.returnValue = res;
  });
});

ipcMain.on("UpdateInputType",async(event, arg) => {
  console.log(arg);
  await model.UpdateInputType(arg)
  .then(res=>{
    console.log(res)
    event.returnValue = res;
  });
});

ipcMain.on("AddNewMasterData",async(event, arg) => {
  console.log(arg);
  event.returnValue = await model.AddNewMasterData(arg)
});

ipcMain.on("GetAllMasterData",async(event, arg) => {
  console.log(arg);
  event.returnValue = await model.GetAllMasterData()
})
ipcMain.on("GetMasterDataValues",async(event, arg) => {
  console.log(arg);
  event.returnValue = await model.GetMasterDataValues(arg)
})
ipcMain.on("AddNewMasterDataValue",async(event, arg) => {
  console.log(arg);
  event.returnValue = await model.AddNewMasterDataValue(arg)
});
ipcMain.on("DeleteMasterDataValue",async(event, arg) => {
  console.log(arg);
  event.returnValue = await model.DeleteMasterDataValue(arg)
});
ipcMain.on("DeleteMasterData",async(event, arg) => {
  console.log(arg);
  event.returnValue = await model.DeleteMasterData(arg)
});
ipcMain.on("UpdateVariableMasterData",async(event, arg) => {
  console.log(arg);
  event.returnValue = await model.UpdateVariableMasterData(arg)
});











// ipcMain.on('findTagsByTemplateId', (event, arg) => {

//   await model.findTagsByTemplateId(arg).then(res=>{
//     console.log(res);
//     console.log('res');

//     var Docxtemplater = require('docxtemplater');
//     var PizZip = require('pizzip');
 
//    var fs = require('fs');
//    var path = require('path');
 
//    //Load the docx file as a binary
//    var content = fs
//        .readFileSync(res.path, 'binary');
 
//    var zip = new PizZip(content);
 
//    //var doc = new Docxtemplater();
//    //doc.loadZip(zip);
 
//    //var doc = new Docxtemplater(content);
//    //var keys = Object.keys(doc.templatedFiles);
//    //console.log(keys)
 
//    var InspectModule = require("docxtemplater/js/inspect-module");
//    var iModule = InspectModule();
//    const doc = new Docxtemplater(zip, { modules: [iModule] });
//    doc.render();
//    var tags = iModule.getAllTags();
//    //console.log(tags);
 
//    event.returnValue = tags






//     event.returnValue = res;
//   });




    
// })
async function RenderDoc(Path,Variables){
  console.log("start RenderDoc")
  console.log(Path)
  console.log(Variables)
  var Docxtemplater = require('docxtemplater');
  var PizZip = require('pizzip');

  var fs = require('fs');
  var path = require('path');

  //Load the docx file as a binary
  var content = fs
      .readFileSync(path.resolve(__dirname, Path), 'binary');

  var zip = new PizZip(content);
  var doc = new Docxtemplater();
  doc.loadZip(zip);
    
    
  doc.setData(
    Variables
  );
  try {
    doc.render()
    //console.log(doc);
    var buf = doc.getZip().generate({type: 'nodebuffer'});
    console.log(buf)
    var DocPath = path.resolve(__dirname, '../output.docx');
  //   fs.exists(DocPath, function fileExists(exists) {
  //     if (exists) {
  //       fs.unlink(DocPath, ()=>{

  //       })
  //     }
  // });
    
    fs.writeFileSync(path.resolve(__dirname, '../output.docx'), buf);
    const {shell} = require('electron');

    shell.openItem(path.resolve(__dirname, '../output.docx'));

    // var PdfBuffer = await docxtopdf.convertHelper(buf,"exportPDF").then((arrayBuffer) => {
    //     return arrayBuffer;
    // }).catch((e) => {
    //     console.error(e);
    // });
    // console.log('PdfBuffer')
    // console.log(PdfBuffer)
    // return PdfBuffer
  }
  catch (error) {
    var e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
    }
    
    console.log(JSON.stringify({error: e}));
    throw error;
  }
}


