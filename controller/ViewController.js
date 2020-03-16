class ViewController {
    constructor(app, htmlPath) {
        this.app = app;
        this.htmlPath = htmlPath;

        app.all('/index', function (req, res, next) {
            res.setHeader('Content-Type', 'text/html;charset=UTF-8');
            res.sendFile(htmlPath + "/index.html");
        });


        // app.get('/aaa', function (req, res) {
        //     res.redirect(302, 'http://www.baidu.com?aaa=123#/main');
        // });
    }
}
module.exports = ViewController