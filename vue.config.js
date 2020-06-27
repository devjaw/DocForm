module.exports = {
  "transpileDependencies": [
    "vuetify"
  ]
}

module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      disableMainProcessTypescript: false,
      mainProcessTypeChecking: false,
      builderOptions: {
        productName: 'DocForm',
        appId: 'com.DocForm.app',
        win: {
          target: ["portable"]
      },
      portable: {
          artifactName: "DocForm.exe"
      },
      directories: {
          
      },
      extraFiles: [
        "log.txt"
      ],
        //Add also your database location
        extraResources: ['src/db/',
                        'src/components/',
                        {
                          "from": "./extraResources/",
                          "to": "extraResources",
                          "filter": [
                            "**/*"
                          ]
                        }] 
        
      },
        //This line: add knex and sqlite3
      externals: ['knex','sqlite3'],
    }
  }
};