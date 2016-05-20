
node publish/webserver.js & browser-sync start --proxy="localhost:8394" --files="app.html, www/css/mystyle.css, www/js/Main.js, www/js/MyApplication.js, www/js/controller/*.js www/js/model/*.js" --browser chrome --no-notify
