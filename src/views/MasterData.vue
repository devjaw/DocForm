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
        <v-card-title class="headline grey lighten-2" primary-title>Add New master</v-card-title>
        <v-card-text>
            <v-row>
               <v-col>
                <v-text-field 
                  label="Master Data Name"
                  v-model="MasterDataName"
                  :error-messages = "ErrorMessage"
                ></v-text-field>
               </v-col>
              </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            v-on:click="AddNewMasterData()">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


 <v-dialog v-model="SettingsDialog" width="500">
      <template>
  <v-card> 
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>Settings</v-toolbar-title>
    </v-toolbar>
        <v-card flat>
          <v-card-text>
            <v-row>
               <v-col>
                <v-text-field 
                  label="Add New"
                  id="NewInputValueText"
                  v-model="NewMasterDataValue"
                ></v-text-field>
               </v-col>
               <v-col>
                <v-btn class="mx-2" fab dark small  color="indigo"
                  v-on:click="AddNewMasterDataValue()">
                  <v-icon dark>mdi-plus</v-icon>
                </v-btn>
               </v-col>
            </v-row>
            <v-row>
              <v-col>
              <div v-for="(Values,i) in MasterDataValues" :key="i">
                <v-row>
                  <v-chip
                    class="ma-2"
                    close
                    color="primary"
                    label
                    text-color="white"
                    @click:close="DeleteMasterDataValue(Values.id)"
                  >
                    {{Values.text}}
                  </v-chip>
                </v-row>
              </div>
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>
  </v-card>
</template>
    </v-dialog>


    <br/><br/><br/>



  <v-data-table :headers="headers" :items="TableResult" item-key="id" class="elevation-1">
      <template v-slot:item.action="{ item }">
      <v-icon small @click="DeleteMasterData(item.id)">
        mdi-delete
      </v-icon>
      <v-icon small @click="GetMasterDataValues(item.id)">
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
    
  name: 'MasterData',
  components: {
    //HelloWorld,
  },

  created() {
      this.GetAllMasterData();
  },

  data: () => ({
      TableResult: [],
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'Name',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      dialog:false,
      SettingsDialog:false,
      MasterDataValues : [],
      MasterDataName : null,
      ErrorMessage :null,
      NewMasterDataValue : '',
      CurrentMasterDataId : null
    }),
    methods: {
      DeleteMasterData: function(MasterDataId){
        this.$confirm('Do you really want to delete this master data?').then(del => {
          if(del){
            var res=  ipc.sendSync('DeleteMasterData',MasterDataId)
            console.log(res)
            this.GetAllMasterData();
          }
        })
      },
      AddNewMasterData:function(){
        var MasterDataName = this.MasterDataName;
        var res=  ipc.sendSync('AddNewMasterData',MasterDataName)
        this.MasterDataName ='';
        console.log(res)
        if(!res.success){
          this.ErrorMessage = res.message;
        }
        else{
          this.ErrorMessage = null;
          this.dialog = false;
          this.GetAllMasterData();
        }
      },
      GetAllMasterData:function(){
         var res=  ipc.sendSync('GetAllMasterData')
         console.log(res)
          this.TableResult = [];
          this.TableResult.push(res)
          this.TableResult = this.TableResult[0]
      },
      GetMasterDataValues:function(MasterDataId){
        var res=  ipc.sendSync('GetMasterDataValues',MasterDataId)
        this.MasterDataValues = res
        this.CurrentMasterDataId = MasterDataId
        this.SettingsDialog = true;
      },
      AddNewMasterDataValue:function(){
        console.log(this.CurrentMasterDataId)
       var ValueData = {
         MasterDataId : this.CurrentMasterDataId,
         Value : this.NewMasterDataValue
       }
       var res=  ipc.sendSync('AddNewMasterDataValue',ValueData)
       console.log(res)
        this.NewMasterDataValue = '';
        this.GetMasterDataValues(this.CurrentMasterDataId);
      },
      DeleteMasterDataValue :function(MasterDataValueId){
        console.log(MasterDataValueId)
        var res=  ipc.sendSync('DeleteMasterDataValue',MasterDataValueId)
       console.log(res)
       this.GetMasterDataValues(this.CurrentMasterDataId);
      }
    },
};
</script>
