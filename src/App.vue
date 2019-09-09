<template>
  <div id="app">
    <TopNav/>
    <div id="content">
      <router-view :key="$route.fullPath"/>
    </div>
  </div>
</template>
