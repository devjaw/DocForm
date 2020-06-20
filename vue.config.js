module.exports = {
  "transpileDependencies": [
    "vuetify"
  ]
}

module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        //Add also your database location
        extraResources: ['src/db/','src/components/'] 
        
      },
        //This line: add knex and sqlite3
      externals: ['knex','sqlite3','@nativedocuments/docx-wasm'],
    }
  }
};