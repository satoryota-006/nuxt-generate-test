<template>
  <div>
    一覧
    <ul>
      <li v-for="post in posts" :key="post.id">
        <nuxt-link :to="`/post/${post.id}`">
        {{post.title}}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
  
<script>
export default {
  async asyncData({ $axios, $config, payload }) {
    //payloadを使う
    const posts = payload !== undefined ? payload
      : (await $axios.get('https://qiita.com/api/v2/items?page=1&per_page=10',
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
