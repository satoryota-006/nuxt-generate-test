<template>
  <div>
    {{ shop.rooms }}
  </div>
</template>

<script>
import { createClient } from 'microcms-js-sdk'
export default {
  asyncData ({ payload, params }) {
    if (payload) {
      return { shop: payload }
    } 
    else {
      const microcms = createClient({
        serviceDomain: 'rizap',
        apiKey: 'b00813a28c79431da674999bf7bbe0cc6121'
      })
      const fields = [
        'rooms.id',
        'banner.boolean',
        'banner.image.url',
        'banner.alt',
        'notice.boolean',
        'notice.body',
        'images',
        'map'
      ]
      return microcms
        .get({
          endpoint: 'chocozap_shops',
          queries: {
            filters: `studio_id[equals]${params.id}`,
            fields: fields.join(',')
          }
        })
        .then((response) => {
          const shop = {
            name: '',
            address: '',
            access: '',
            latitude: '',
            longitude: '',
            machines: [],
            description: '',
            nearest: []
          }
          // microCMSの登録漏れに対応するため
          if (response.contents.length !== 0) {
            // 設備と画像はmicroCMSで空欄で登録ができてしまうためnullは除外する
            shop.rooms = response.contents[0].rooms.filter(function (room) {
              return (room.room)
            })
            shop.images = response.contents[0].images.filter(function (image) {
              return (image.image)
            })
            if (response.contents[0].banner) {
              shop.banner = response.contents[0].banner
            } else {
              shop.banner = { boolean: false }
            }
            shop.notice = response.contents[0].notice
            shop.map = response.contents[0].map
          }
          return { shop }
        })
    }
  }

}
</script>
