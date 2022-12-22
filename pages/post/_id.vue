<template>
  <div>
    {{posts.title}}
  </div>
</template>

<script>
export default {
  async asyncData({$axios, $config, params, payload}){
    //payloadを使う
    const posts = payload !== undefined ? payload
      : (await $axios.get(`https://qiita.com/api/v2/items/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${$config.qiitaToken}`,
          }
        }
        )).data
    return {posts}
  }
}
</script>
