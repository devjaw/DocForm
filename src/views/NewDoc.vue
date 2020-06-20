<template>
<v-col cols="12">

    

    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on }">
          
        <v-btn v-on="on" class="mx-2" color="primary">
            <v-icon dark>mdi-plus</v-icon>Add New
        </v-btn>
      </template>

      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
         Add New
        </v-card-title>

        <v-card-text>
            <v-text-field label="Template Name" v-model="TemplateName"></v-text-field>
            <v-file-input show-size accept="docx/*" label="File input" v-model="TemplatePath"></v-file-input>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            v-on:click="SaveNewTemplate()">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


 <v-dialog v-model="SettingsDialog" width="500">
      <!-- <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
         Settings
        </v-card-title>

        <v-card-text>
            <v-expansion-panels>
              <v-expansion-panel v-for="(TableResult,i) in TableResult" :key="i">
                <v-expansion-panel-header>Item</v-expansion-panel-header>
                <v-expansion-panel-content>
                  dd
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            v-on:click="SaveNewTemplate()">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>-->
      <template>
  <v-card> 
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>Settings {{activetab}}</v-toolbar-title>
    </v-toolbar>
    <v-tabs vertical v-model="activetab">
      <v-tab v-for="(TemplateVariable) in TemplateVariables" :key="TemplateVariable.id" 
              :href="`#${TemplateVariable.id}${TemplateVariable.name}`"
              @click="TabChange(TemplateVariable.id)" >
        {{TemplateVariable.name}}
      </v-tab>

      <v-tab-item v-for="(TemplateVariable) in TemplateVariables" :key="TemplateVariable.id" :value="`${TemplateVariable.id}${TemplateVariable.name}`">
        <v-card flat>
          <v-card-text>
            <v-select
            :items="InputForms"
            item-text="name"
            item-value="id"
            label="Select Input"
            v-model="TemplateVariable.InputId"
            v-on:input="OnSelectChange(TemplateVariable.InputId,TemplateVariable.id)"
            solo
            ></v-select>
            <div v-if="TemplateVariable.InputId == 3 || TemplateVariable.InputId == 4">
              <v-row>
               <v-col>
                 <v-select
                    :items="MasterData"
                    item-text="Name"
                    item-value="id"
                    label="Select Input"
                    v-model="TemplateVariable.MasterDataId"
                    solo
                    v-on:input="OnSelectMasterDataChange(TemplateVariable.id,TemplateVariable.MasterDataId)"
                    ></v-select>
                <!-- <v-text-field 
                  label="Add New"
                  id="NewInputValueText"
                  v-model="NewInputValueText"
                ></v-text-field>
               </v-col>
               <v-col>
                 
                <v-btn class="mx-2" fab dark small  color="indigo"
                  v-on:click="AddNewTextValueFun(TemplateVariable.id,TemplateVariable.InputId)">
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn> -->
               </v-col>
              </v-row>
              
                  
                <!-- <div v-if="TemplateVariable.InputId == 3">
                  <v-radio-group v-for="(Data,i) in InputValueData" :key="i">
                    <v-row >
                      <v-btn class="ma-2" text icon color="red" v-on:click="DeleteVariableInput(Data)" >
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                      <v-radio disabled :label="Data.text"></v-radio>
                    </v-row>
                  </v-radio-group>
                </div>

                <div v-if="TemplateVariable.InputId == 4">
                  <v-select
                    :items="InputValueData"
                    item-text="text"
                    item-value="id"
                    label="Select Input"
                    solo
                    ></v-select>
                </div> -->
              
              
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>

    </v-tabs>
  </v-card>
</template>
    </v-dialog>


    <br/><br/><br/>



  <v-data-table  :headers="headers" :items="TableResult" item-key="id" class="elevation-1">
      <template v-slot:item.action="{ item }">
      <v-icon small @click="DeleteTemplate(item)">
        mdi-delete
      </v-icon>
      <v-icon small @click="TemplateSettings(item)">
        mdi-cog
      </v-icon>
      
    </template>
    
  </v-data-table>

</v-col>
  
</template>

<script>


const electron = require("electron");
const ipc = electron.ipcRenderer;
export default {
    
  name: 'NewDoc',
  components: {
    //HelloWorld,
  },

  created() {
      this.GetAllTemplates();
      this.GetMasterData();
  },

  data: () => ({
      TableResult: [],
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Path', value: 'path' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      dialog:false,
      SettingsDialog:false,
      TemplateName:'',
      TemplatePath:null,
      TemplateVariables : [],
      InputForms:[
        {id:1,name:"text"},
        {id:3,name:"radio bottoms"},
        {id:4,name:"select"}
      ],
      NewInputValueText : '',
      InputValueData : [],
      activetab:0,
      MasterData:[],
    }),
    methods: {
      do_action: function() {
        ipc.send("test",function(events,args){
           alert('hi')
            console.log(events)
            console.log(args)
        });

        var config = ipc.sendSync('findParameters', '')
        var a = Object.keys(config)
        console.log(a)
        a.forEach(element => {
          this.tags.push({
            key: element,
            value : ''
         });
        });
        console.log(this.tags)
        this.IsHidden = true;
      },
      SaveNewTemplate:function(){
          console.log(this.TemplatePath)
        var Template = {
            name : this.TemplateName,
            path : this.TemplatePath.path
        }
        ipc.sendSync('SaveNewTemplate',Template)
        this.dialog = false;
        this.GetAllTemplates();
      },
      GetAllTemplates:function(){
          var res=  ipc.sendSync('GetAllTemplates')
          console.log(res)
          this.TableResult = [];
          this.TableResult.push(res)
          this.TableResult = this.TableResult[0]
      },
      DeleteTemplate: function(template){
        this.$confirm('Do you really want to delete this template?').then(del => {
          if(del){
            var res=  ipc.sendSync('DeleteTemplate',template.id)
            console.log(res)
            this.GetAllTemplates();
          }
        })
        console.log(template)
        //var res=  ipc.sendSync('DeleteTemplate',template.id)
        
        
      },
      TemplateSettings:function(template){
        var res=  ipc.sendSync('GetTemplateVariables',template.id)
        var InputId = res.InputId;
        this.TemplateVariables = res
        this.SettingsDialog = true;
        setTimeout(() => {
          console.log('this.activetab')
          console.log(this.activetab)
          console.log(template)
          
          var VariableId = this.activetab.toString().charAt(0);
          console.log("this is var id " + VariableId)
          console.log(res)

          this.GetAllVariablesValues(VariableId,InputId)
        }, 50);
        
      },
      TabChange:function(templateId){
        console.log(templateId)
        setTimeout(() => {
          console.log('this.activetab')
          console.log(this.activetab)
        }, 50);
      },
      OnSelectChange:function(InputId,VariableId){
        console.log(InputId)
        console.log(VariableId)
        var VariableToBeUpdated = {
          InputId : InputId,
          VariableId : VariableId
        }
        var res=  ipc.sendSync('UpdateInputType',VariableToBeUpdated);
        console.log(res);
        this.GetAllVariablesValues(VariableId,InputId)
        // alert(id)
        // if(id == 2){
        //   //Update Input type 
        //   //var res=  ipc.sendSync('UpdateInputType',id)
        //   // this.InputValueData = [
        //   //   {id:1,text:"kia"},
        //   //   {id:2,text:"toyota"}
        //   // ]
        // }
        // console.log(id)
      },
      AddNewTextValueFun:function(TemplateVariableId,InputId){
        var TextValue = {
            Text : this.NewInputValueText,
            InputId : InputId,
            VariableId : TemplateVariableId,
            TemplateId : this.TemplateVariables[0].templateid
        }
      console.log(TextValue)
       var res=  ipc.sendSync('AddNewTextValueFun',TextValue)
       console.log(res)
        this.NewInputValueText = '';
        this.GetAllVariablesValues(TemplateVariableId);
        
      },
      GetAllVariablesValues:function(VariableId,InputId){
        var GetVariable = {
          VariableId: VariableId,
          InputId : InputId
        }
        var res=  ipc.sendSync('GetAllVariablesValues',GetVariable)
        console.log(res)
        this.InputValueData = res
      },
      DeleteVariableInput:function(InputData){
        console.log(InputData)
        var res=  ipc.sendSync('DeleteVariableInput',InputData)
        console.log(res)
        this.InputValueData = res
        this.GetAllVariablesValues(InputData.variableid);
      },
      GetMasterData:function(){
          var res=  ipc.sendSync('GetAllMasterData')
         console.log(res)
          this.MasterData = [];
          this.MasterData.push(res)
          this.MasterData = this.MasterData[0]
      },
      OnSelectMasterDataChange:function(VariableId,MasterDataId){
        var VariableData = {
          VariableId:VariableId,
          MasterDataId:MasterDataId
        }
        console.log(VariableData)
        var res=  ipc.sendSync('UpdateVariableMasterData',VariableData)
        console.log(res)
        
      }
    },
};
</script>
