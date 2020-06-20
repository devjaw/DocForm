<template>
<nav>

  <v-app>
    
    <v-app-bar
      color="primary"
      app fixed permanent
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
        <h1 style="color:white">DocFrom</h1>
      </div>

      <v-spacer></v-spacer>

      
    </v-app-bar>


    <v-navigation-drawer app fixed permanent>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Application
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item router to='/'>
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>


        <v-list-item router to='/NewDoc'>
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>New Doc</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item router to='/MasterData'>
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Master Data</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view></router-view>
    </v-content>
    
  </v-app>
  </nav>
</template>

<script>
//import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',
  

  components: {
    //HelloWorld,
  },

  data: () => ({
    items: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard' },
          { title: 'New Doc', icon: 'mdi-view-dashboard' },
        ],
        right: null,
  }),
};
</script>
