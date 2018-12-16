import Vue from 'vue'
import Notifications from 'vue-notification'
Vue.use(Notifications)

export function notif(type, descrption) {
    console.log(type);
    if (type === 'success') {
        if (!descrption) {
            descrption = 'Данные отправлены на сервер';
        }
        $notify({
            group: 'foo',
            type: "success",
            title: 'Успешно сохранено',
            text: descrption
        });
    } else if (type === 'error') {
        if (!descrption) {
            descrption = 'Sorry';
        }
        console.log(error);
        $notify({
            group: 'foo',
            type: "error",
            title: 'Произошла ошибка',
            text: descrption
        });
    }
}