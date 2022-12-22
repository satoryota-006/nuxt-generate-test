<template>
  <div>
    {{post.title}}
  </div>
</template>

<script>
export default {
  async asyncData({$axios, $config, params}){
    return await $axios.get(`https://qiita.com/api/v2/items/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${$config.qiitaToken}`,
        }
      }
    ).then(response=>{
      return {
        post: response.data
      }
    })
  }
}
</script>
