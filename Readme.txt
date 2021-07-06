-package.json: lưu tên các thư viện
-app.js: để chạy server
-Node_modules: lưu các dữ liệu của thư viện
#SRC:
-Common(database.js): kết nối database của WOM
-Middleware(multer.js): đăng ảnh sản phẩm
-Controller, middlerware code xử lý dữ liệu
-Config: cấu hình đường dẫn thư mục
-Routes: nếu trùng khớp với đường dẫn thì sẽ thực hiện middleware và controller
if(middleware k chạy thì k chạy controller)
-Models: dùng để cung cấp dữ liệu, thực hiện kết nối, trích lọc, chèn,
chỉnh sửa dữ liệu trong database, tương tác với file system, network
-Views: giao diện