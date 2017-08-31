<template>
  <p>
    Menu
  </p>
</template>

<script>
export default {
  data() {
    return {
      platform: os.platform(),
      versions: process.versions
    }
  }
}
</script>
