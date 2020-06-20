/**
 * Shows how to use chaining rather than the `serialize` method.
 */
"use strict";

var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./AppDB.sqlite3"
    }
});
var sqlite3 = require('sqlite3').verbose();
var db;
var query;
var now = new Date();
var status ={};

module.exports.createDb = function () {
    console.log("createDb chain");
    db = new sqlite3.Database('AppDB.sqlite3', createTable);
}

function OpenDB(){
    if(!db.open)
        db = new sqlite3.Database('AppDB.sqlite3');
}

function createTable() {
    console.log("createTable lorem");
    query = knex.schema.createTableIfNotExists('templates', function (table) {
        table.increments();
        table.string('name');
        table.string('path');
        table.timestamps();
    }).toString()
    db.run(query);

    query = knex.schema.createTableIfNotExists('variables', function (table) {
        table.increments();
        table.integer('templateid');
        table.string('name');
        table.integer('InputId');
        table.timestamps();
    }).toString()
    db.run(query);

    query = knex.schema.createTableIfNotExists('elements', function (table) {
        table.increments();
        table.integer('templateid');
        table.timestamps();
    }).toString()
    db.run(query);

    query = knex.schema.createTableIfNotExists('documents', function (table) {
        table.increments();
        table.integer('variableid');
        table.integer('elementid');
        table.string('value');
        table.timestamps();
    }).toString()
    db.run(query);

    console.log('Insert Table Types start')
    knex.schema.createTableIfNotExists('inputtypes', function (table) {
        table.integer('id');
        table.integer('name');
    }).then(res=>{
        console.log('Insert Table Types start1')
        var val = "textbox";
        var rawStr = "INSERT INTO inputtypes(id,name) SELECT 1, ? WHERE NOT EXISTS(SELECT 1 FROM inputtypes WHERE name = ?);";
        console.log(rawStr)
        knex.raw(rawStr, [val,val]).then(function(resp) {
            console.log("ON-QUERY data:", resp);
         });

        val = "radio";
        rawStr = "INSERT INTO inputtypes(id,name) SELECT 2, ? WHERE NOT EXISTS(SELECT 1 FROM inputtypes WHERE name = ?);";
        knex.raw(rawStr, [val,val]).then(function(resp) {
            console.log("ON-QUERY data:", resp);
         });

         val = 'checkbox';
         rawStr = "INSERT INTO inputtypes(id,name) SELECT 3, ? WHERE NOT EXISTS(SELECT 1 FROM inputtypes WHERE name = ?);";
         knex.raw(rawStr, [val,val]).then(function(resp) {
             console.log("ON-QUERY data:", resp);
         });

        val = 'select';
        rawStr = "INSERT INTO inputtypes(id,name) SELECT 4, ? WHERE NOT EXISTS(SELECT 1 FROM inputtypes WHERE name = ?);";
        knex.raw(rawStr, [val,val]).then(function(resp) {
            console.log("ON-QUERY data:", resp);
        });
    });

    query = knex.schema.createTableIfNotExists('documents', function (table) {
        table.increments();
        table.integer('variableid');
        table.integer('elementid');
        table.string('value');
        table.timestamps();
    }).toString()
    db.run(query);


    query = knex.schema.createTableIfNotExists('MasterData', function (table) {
        table.increments();
        table.string('Name');
        table.timestamps();
    }).toString()
    db.run(query);

    query = knex.schema.createTableIfNotExists('MasterDataValues', function (table) {
        table.increments();
        table.string('text');
        table.integer('MasterDataId');
        table.timestamps();
    }).toString()
    db.run(query);

    query = knex.schema.createTableIfNotExists('VariablesData', function (table) {
        table.increments();
        table.integer('variableid');
        table.integer('MasterDataId');
        table.timestamps();
    }).toString()
    db.run(query);



    closeDb();
}

function closeDb() {
    //console.log("closeDb");
    db.close();
}

module.exports.SaveNewTemplate = function (Template){
    

    console.log('SaveNewTemplate quer1y')
    //OpenDB();
    //query =knex('templates').insert({name: Template.name,path:Template.path,created_at:now,updated_at:now}).toString()
    knex('templates').insert({name: Template.name,path:Template.path,created_at:now,updated_at:now},'id')
    .then(function (result) {
        console.log(result)
        //return result[0]
        var TemplateId = result[0]
        console.log('ttt')
        var Docxtemplater = require('docxtemplater');
         var PizZip = require('pizzip');
      
        var fs = require('fs');
        var path = require('path');
      
        //Load the docx file as a binary
        var content = fs
            .readFileSync(path.resolve(Template.path), 'binary');
      
        var zip = new PizZip(content);
      
        var InspectModule = require("docxtemplater/js/inspect-module");
        var iModule = InspectModule();
        const doc = new Docxtemplater(zip, { modules: [iModule] });
        doc.render();
        var tags = iModule.getAllTags();
      
        var a = Object.keys(tags)
      
        module.exports.InsertTemplateVariables(TemplateId,a);

    })
    //db.run(query);
    //closeDb();
}
module.exports.GetAllTemplates = function (){
    console.log('GetAllTemplates query')
    return knex.select('*').from('templates').then()
}

module.exports.DeleteTemplate = function (TemplateId){
    console.log('delete template query')
    return knex('templates').where('id', TemplateId).del().then()
}

module.exports.InsertTemplateVariables = function (TemplateId,Variables){
    console.log('InsertTemplateVariables')

    Variables.forEach(Variable => {
        knex('variables').insert({templateid: TemplateId,name:Variable,InputId:1,created_at:now,updated_at:now}).then(res=>{
            var VariableId = res[0];
            knex('VariablesData').insert({variableid: VariableId,MasterDataId:null,created_at:now,updated_at:now}).then(res=>{
                console.log(res);
                console.log('forEach insert res');
            });
        });
    });
}
module.exports.GetTemplateVariables = async function (TemplateId){
    console.log('GetTemplateVariables')
    console.log(TemplateId)
    return await knex.select('variables.*').select('VariablesData.MasterDataId')
        .leftJoin('VariablesData', 'VariablesData.variableid', '=', 'variables.id')
        .from('variables').where('variables.templateid', TemplateId).then(res=>{
            return res
        })
     
}
module.exports.GetTemplatePath = function (TemplateId){
    console.log('GetDocPath')
    console.log(TemplateId)
    return knex.select('path').from('templates').where('id', TemplateId).then()
}
module.exports.AddNewTextValueFun = function (TextValueData){
    console.log("AddNewTextValueFun");
    console.log(TextValueData);
    var NewMasterDataId = 0;
        return knex.transaction(trx => {
            return knex.insert({text: TextValueData.Text}).into('MasterDataValues').transacting(trx)
            .then(function(res) {
                console.log('res data')
                console.log(res[0])
                NewMasterDataId = res[0]
                console.log(NewMasterDataId)
                return knex('variables')
                .update({
                    InputId: TextValueData.InputId
                })
                .where('id', '=', TextValueData.VariableId)
                .transacting(trx).then(function(res) {
                    return knex('VariablesData').transacting(trx).insert({variableid: TextValueData.VariableId,
                        MasterDataId:NewMasterDataId,
                        variableid:TextValueData.VariableId,
                        created_at:now,
                        updated_at:now})
                })
                
                
            })
            .then(trx.commit)
            .catch(trx.rollback);
            
            

            
        }).then()
          .catch(function(err) {
            console.error(err);
          });
          
     
}
module.exports.GetAllVariablesValues = function (VariableData){
    return knex.select('MasterDataValues.*')
    //.select('MasterData.text')
    .from('VariablesData')
    .innerJoin('MasterData', 'VariablesData.MasterDataId', '=', 'MasterData.id')
    .innerJoin('MasterDataValues', 'MasterDataValues.MasterDataId', '=', 'MasterData.id')
    .where('VariablesData.variableid', VariableData.VariableId)
    .then()
}

module.exports.DeleteVariableInput = function (VariableData){
    return knex('VariablesData')
    .where('id', VariableData.id)
    .where('id', VariableData.id)
    .del()
    .then()
}
module.exports.UpdateInputType = function (VariableData){
    console.log(VariableData)
    return knex('variables')
    .update({
        InputId: VariableData.InputId
    })
    .where('id', '=', VariableData.VariableId)
    .then()
}

module.exports.GetAllVariablesInputValues = function(VariableIds){
    return knex.select('VariablesData.variableid')
    .select('VariablesData.MasterDataId')
    .select('MasterDataValues.id')
    .select('MasterDataValues.text')
    .from('VariablesData')
    .innerJoin('MasterData', 'VariablesData.MasterDataId', '=', 'MasterData.id')
    .innerJoin('MasterDataValues', 'MasterDataValues.MasterDataId', '=', 'MasterData.id')
    .whereIn('VariablesData.variableid',VariableIds)
    .then()
}

module.exports.AddNewMasterData = async function(MasterDataName){
    var count;

    count = await knex('MasterData').count('name as count').where('name', MasterDataName).first()
    count = count.count
    
    if(count === 0){
        return knex('MasterData').insert({name: MasterDataName,created_at:now,updated_at:now}).then(res=>{
            return status={
                success: true,
                message: null
            }
        });
    }
    else{
        return status={
            success: false,
            message: "The name is exists"
        }
    }
}
module.exports.GetAllMasterData = async function(){
    return await knex.select('*').from('MasterData').then(res=>{
        return res 
    })
}
module.exports.GetMasterDataValues = async function(MasterDataId){
    return await knex.select('*').from('MasterDataValues').where('MasterDataId', MasterDataId).then(res=>{
        return res 
    })
}
module.exports.AddNewMasterDataValue = async function(ValueData){
    return await knex('MasterDataValues').insert({MasterDataId: ValueData.MasterDataId,text:ValueData.Value,created_at:now,updated_at:now}).then(res=>{
        return status={
            success: true,
            message: null
        }
    });
}
module.exports.DeleteMasterDataValue = async function(MasterDataVelueId){
    return knex('MasterDataValues').where('id', MasterDataVelueId).del().then(res=>{
        return status={
            success: true,
            message: null
        }
    })
}
module.exports.DeleteMasterData = async function(MasterDataId){
    try {
        await knex.transaction(async trx => {
            await knex('MasterData').where('id', MasterDataId).del().transacting(trx)
            await knex('MasterDataValues').where('MasterDataId', MasterDataId).del().transacting(trx)
            await knex('VariablesData').update({
                MasterDataId: null
            }).where('MasterDataId', MasterDataId).transacting(trx)
            return status={
                success: true,
                message: null
            }
        })
    } catch (error) {
        return status={
            success: false,
            message: error
        }
      }
}
module.exports.UpdateVariableMasterData = async function(VariableData){
    return await knex('VariablesData').update({
            MasterDataId: VariableData.MasterDataId
        }).where('variableid', VariableData.VariableId).then(res=>{
        return status={
            success: true,
            message: null
        }
    })
}



