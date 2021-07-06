module.exports = {
    app: {
        port: 3000,
        static_folder: __dirname + '/../src/public',
        view_folder: __dirname + '/../src/views',
        view_engine: 'ejs',
        file_upload: __dirname + '/../src/public/image',
        mongo_url: 'mongodb://localhost/WorldOfModel'
    },
}