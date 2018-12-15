import { HTTP } from '../../../http-common'

/*export function getData() {

}*/

export function test() {
    let x = 1;
    setTimeout(() => {
        x = 5;
    }, 4000);
    return x;


    // Создаётся объект promise
    /*let promise = new Promise((resolve, reject) => {

        setTimeout(() => {
            // переведёт промис в состояние fulfilled с результатом "result"
            resolve('+++');
        }, 5000);

    });

    // promise.then навешивает обработчики на успешный результат или ошибку
    promise
        .then(
            result => {
                // первая функция-обработчик - запустится при вызове resolve
                //alert("Fulfilled: " + result); // result - аргумент resolve
                return result;
            },
            error => {
                // вторая функция - запустится при вызове reject
                //alert("Rejected: "); // error - аргумент reject
                return 0;
            }
        );*/
}