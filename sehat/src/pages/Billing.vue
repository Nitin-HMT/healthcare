<template>
    <div class="hidden md:flex flex-col text-xs text-red-600">
         Demo
        <!--{{posUrl}} -->
    </div>
    
    <!-- <div class="h-full">
        <iframe
        ref="posFrame"
        :src="posUrl"
        frameborder="0"
        allowfullscreen/>
    </div> -->
</template>
<!-- <script setup>
const posUrl =`${window.location.origin}/desk/point-of-sale`
</script> -->
<style scoped>
.billing-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background: white;
}
iframe {
    width:100%;
    height: 100%;
    border: none;
}
</style>