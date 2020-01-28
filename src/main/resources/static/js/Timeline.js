let pagination = new Pagination('http://localhost:8080/content/image');
let timeline;
window.onload = function () {
    timeline = new Vue({
        el: '#timeline',
        data: {
            imgs: [],
            timelineloggedIn: true,
            username: '',
            password: ''
        },
        methods: {
            checkLogin: function () {
                console.log('Check login!');
                timeline.loggedIn = localStorage.getItem('userLoginToken') ? true : false;
                if (localStorage.getItem('userLoginToken')) {
                    console.log('Authenticated!');
                }
            },
            login: function () {
                $.ajax("http://localhost:8080/user/login", {
                    type: 'POST',
                    data: {username: timeline.username, password: timeline.password},
                    contentType: "application/x-www-form-urlencoded"
                }).done(function (result) {
                    let token = result;
                    if (token) {
                        console.log(token);
                        localStorage.setItem('userLoginToken', 'Bearer ' + token);
                        timeline.checkLogin();
                    }
                });
            },
            initImagesData: function () {
                $.ajax(pagination.render(), {headers: {Authorization: localStorage.getItem("userLoginToken")}}).done(function (result) {
                    timeline.imgs = result;
                    console.log(timeline.imgs);
                }).error(function (err) {
                    console.log(err);
                });
            },
            nextPageImagesData: function () {
                pagination.nxt();
                $.ajax(pagination.render(), {headers: {Authorization: localStorage.getItem("userLoginToken")}}).done(function (result) {
                    timeline.imgs = result;
                });
            },
            prevPageImagesData: function () {
                pagination.prv();
                $.ajax(pagination.render(), {headers: {Authorization: localStorage.getItem("userLoginToken")}}).done(function (result) {
                    timeline.imgs = result;
                });
            },
            transform: function (img) {
                $.ajax('http://localhost:8080/transform/' + img.id, {
                    type: 'POST',
                    headers: {Authorization: localStorage.getItem("userLoginToken")}
                }).done(function (result) {
                    timeline.initImagesData();
                })
            },
            uploadImage(event) {
                let data = new FormData();
                data.append("name", "myFile")
                data.append('file', event.target.files[0]);

                $.ajax('http://localhost:8080/content/image', {
                    type: 'POST',
                    data: data,
                    processData: false,
                    headers: {Authorization: localStorage.getItem("userLoginToken")}
                }).done(function () {
                    timeline.initImagesData();
                });
            }
        }
    });
    timeline.checkLogin();
    timeline.initImagesData();
}
