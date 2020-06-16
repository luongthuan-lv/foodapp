// gọi express
let express = require('express');
// cấu hình handlebars
let hbs = require('express-handlebars');

// dùng để trao đổi dữ liệu với server
let body = require('body-parser');

// dùng để upload file
let multer = require('multer');

// tạo app để cấu hình router
let app = express();
let mongoose = require('mongoose');
// kết nối với data mongoose
mongoose.connect('mongodb+srv://luongthuan:lt05122000@cluster0-mcn0m.mongodb.net/assign', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(function () {
    console.log('Mongoose is connected')
});

// import các file js ở mục model
let userSchema = require('./model/userSchema');
let productSchema = require('./model/productSchema');
let clientSchema = require('./model/clientSchema');
let cartSchema = require('./model/cartSchema');

// dùng để tạo 1 collision  trong code
// collision là tham số thứ 3
let DataUser = mongoose.model('user', userSchema, 'user');
let DataProduct = mongoose.model('product', productSchema, 'product');
let DataClient = mongoose.model('client', clientSchema, 'client');
let DataCart = mongoose.model('cart', cartSchema, 'cart');

app.engine('.hbs', hbs({
    extname: 'hbs',
    defaultLayout: '',
    layoutsDir: '',

}));
app.use(body.json());
// sử dụng thư viện để post
app.use(body.urlencoded({extended: true}));
// câu lệnh để nhúng css , fonts bên hbs
app.use(express.static('public'));

// lưu template vào folder 'views'
app.set('view engine', '.hbs');

// chạy lên local host với port là 1234
app.listen(1234);
console.log('Localhost: 1234');


// Lấy ảnh từ bộ nhớ
let storage = multer.diskStorage({
    destination: function (require, response, cb) {
        // định nghĩa nơi file upload sẽ được lưu lại
        cb(null, './public/uploads');

    },
    filename: function (require, file, cb) {


        // Tên của file nối thêm một cái nhãn thời gian để đảm bảo không bị trùng
        let filename = `${Date.now()}-LuongThuan-${file.originalname}`;
        var pathss = '../uploads/' + filename;
        console.log(pathss);
        if (!filename.endsWith(".jpg")) {
            return cb("Vui lòng up file có đuôi là jpg", filename);
        }

        cb(null, filename)
    },

});
// giưới hạn kích thước file không quá 2mb
let upload = multer({
    storage: storage, limits: {
        fileSize: 2 * 1024 * 1024
    }
});


app.get('/', async (req, res) => {
    // lấy toàn bộ dữ liệu ở colection Product
    let dataProduct = await DataProduct.find({});

    // lấy toàn bộ dữ liệu ở colection User
    let dataUser = await DataUser.find({});

    // lấy toàn bộ dữ liệu ở colection Client
    let dataClient = await DataClient.find({});
    try {
        res.render('index', {dataProduct, dataUser, dataClient})
    } catch (e) {
        res.send('Có lỗi sảy ra khi lay du lieu ' + e.message)
    }
});
// lấy toàn bộ dữ liệu colection user
app.get('/user', async (req, res) => {
    let dataUser = await DataUser.find({});
    res.render('user', {dataUser})
});
// lấy toàn bộ dữ liệu colection client
app.get('/client', async (req, res) => {
    let dataClient = await DataClient.find({});
    res.render('client', {dataClient})
});

app.get('/index', function (req, res) {
    res.redirect('/')
});

app.get('/getallproduct', async (req, res) => {
    let dataProduct = await DataProduct.find({});
    res.send(dataProduct)
});


// USER

// Put dũ liệu lên form update user
app.post('/updateUser', function (req, res) {
    var idUser = req.body.iduser;
    var usernameUser = req.body.usernameuser;
    var fullnameUser = req.body.fullnameuser;
    var roleUser = req.body.roleuser;
    var birthdayUser = req.body.birthdayuser;
    var passUser = req.body.passuser;
    res.render('updateUser', {idUser, usernameUser, fullnameUser, roleUser, birthdayUser, passUser})
});

// Lấy dữ liệu từ form update user
app.post('/updateUserNew', upload.single('avatar1'), async (req, res) => {
    var idUserN = req.body.idUserNew;
    var usernameUserN = req.body.usernameUserNew;
    var fullnameUserN = req.body.fullnameUserNew;
    var roleUserN = req.body.roleUserNew;
    var birthdayUserN = req.body.birthdayUserNew;
    var passUserN = req.body.passUserNew;
    var linkimageUserN = '../uploads/' + req.file.filename;
    var linkpathUserN = req.file.path;
    try {
        const sdd = await DataUser.findByIAdndUpdate(idUserN, ({
            username: usernameUserN,
            fullname: fullnameUserN,
            role: roleUserN,
            birthday: birthdayUserN,
            pass: passUserN,
            image: linkimageUserN
        }));
        if (!sdd) {
            res.end("Khong tim thay");
        } else {
            // reset lại dữ liệu
            let dataUser = await DataUser.find({});
            res.render('user', {dataUser})
            /*res.redirect('/')*/
        }
    } catch (e) {
        res.send('Loi khi update: ' + e.message)
    }
});

// xóa dữ liệu user
app.post('/deleteUser', async (req, res) => {
    var iduser = req.body.iduser;
    try {
        const deuser = await DataUser.findByIdAndDelete(iduser);
        if (!deuser) {
            res.send('Khong tim thay gia tri');
        } else {
            /*res.redirect('/')*/
            let dataUser = await DataUser.find({});
            res.render('user', {dataUser})
        }
    } catch (e) {
        res.send('Loi khi delete user ' + e.message)
    }
});

// chuyển đến form add user
app.post('/addUser', function (req, res) {
    res.render('addUser')
});

// lấy dữ liệu từ form user
app.post('/addUserNew', upload.single('avatar1'), async (req, res) => {
    try {

        var nameadduser = req.body.usernameUerAdd;
        var fullnameadduser = req.body.fullnameUserAdd;
        var roleadduser = req.body.roleUserAdd;
        var dateadduser = req.body.birthdayUserAdd;
        var passadduser = req.body.passUserAdd;
        var linkimageuser = '../uploads/' + req.file.filename;
        var linkpathuser = req.file.path;
        const datauser = new DataUser({
            username: nameadduser,
            fullname: fullnameadduser,
            role: roleadduser,
            birthday: dateadduser,
            image: linkimageuser,
            pass: passadduser
        });
        try {
            // lưu dữ liệu và reset lại
            await datauser.save();
            /* res.redirect('/');*/
            let dataUser = await DataUser.find({});
            res.render('user', {dataUser})
        } catch (e) {
            res.send('Loi khi them ' + e.message);
        }
    } catch (e) {
        res.send('Loi khi update: ' + e.message)
    }
});


//CLIENT

// Truyền dữ liệu vào form updateClient.hbs
app.post('/updateClient', function (req, res) {
    var idClient = req.body.idclient;
    var fullnameClient = req.body.fullnameclient;
    var addressClient = req.body.addressclent;
    var sdtClient = req.body.sdtclient;
    var passClient = req.body.passclient;

    res.render('updateClient', {idClient, fullnameClient, addressClient, sdtClient, passClient})
});

//Lấy dữ liệu từ form updateClient.hbs
app.post('/updateClientNew', async (req, res) => {
    var idClientN = req.body.idClientNew;
    var fullnameClientN = req.body.fullnameClientNew;
    var addressClientN = req.body.addressClientNew;
    var sdtClientN = req.body.sdtClientNew;
    var passClientN = req.body.passClientNew;
    // var linkimageClientN = '../uploads/' + req.file.filename;
    // var linkpathClientN = req.file.path;
    try {
        const client = await DataClient.findByIdAndUpdate(idClientN, ({

            fullname: fullnameClientN,
            address: addressClientN,
            sdt: sdtClientN,
            pass: passClientN,
            //image: linkimageClientN
        }));
        if (!client) {
            res.end("Khong tim thay");
        } else {
            let dataClient = await DataClient.find({});
            res.render('client', {dataClient})
            /*res.redirect('/')*/
        }
    } catch (e) {
        res.send('Loi khi update: ' + e.message)
    }
});

app.post('/deleteClient', async (req, res) => {
    var idclient = req.body.idclient;
    try {
        const declient = await DataClient.findByIdAndDelete(idclient);
        if (!declient) {
            res.send('Khong tim thay gia tri');
        } else {
            let dataClient = await DataClient.find({});
            res.render('client', {dataClient})
            /*res.redirect('/')*/
        }
    } catch (e) {
        res.send('Loi khi delete user ' + e.message)
    }
});

// truyển đến file addClient.hbs
app.post('/addClient', function (req, res) {
    res.render('addClient')
});

app.post('/addClientNew', async (req, res) => {
    try {

        var fullnameaddclient = req.body.fullnameClientAdd;
        var addressaddclient = req.body.addressClientAdd;
        var numberaddclient = req.body.numberphoneClientAdd;
        var passaddclient = req.body.passClientAdd;
        // var linkimageaddclient = '../uploads/' + req.file.filename;
        // var linkpathclient = req.file.path;
        const dataclient = new DataClient({

            fullname: fullnameaddclient,
            address: addressaddclient,
            sdt: numberaddclient,
            pass: passaddclient,
            //image: linkimageaddclient,
        });
        try {
            await dataclient.save();
            let dataClient = await DataClient.find({});
            res.render('client', {dataClient})
            /*res.redirect('/');*/
        } catch (e) {
            res.send('Loi khi them ' + e.message);
        }
    } catch (e) {
        res.send('Loi khi them client: ' + e.message)
    }
});

app.post('/login', async (req, res) => {

        let condition = {
            sdt: req.body.sdt,
            pass: req.body.pass,
        };
        console.log(req.body.sdt, req.body.pass);
        try {
            const user = await DataClient.findOne(condition);
            if (!user) {
                res.send('Invalid numberphone or password !')
            } else {
                res.send(user._id);
                //xét độ dài của send data để check login
                // res.send('Login with '+user);
            }
        } catch (error) {
            res.status(500).send(error);
        }
    });


app.post('/signup', async (req, res) => {
try{
    const datasignclient = new DataClient({

        sdt: req.body.number,
        pass: req.body.pass,
        fullname: req.body.fullname,
        address: req.body.address,
    });
    console.log(req.body.number, req.body.pass, req.body.fullname, req.body.address);
    try {
        const sign = await datasignclient.save();
        if (!sign) {
            res.send('Invalid account registration !')
        } else {
            res.send('Sign Successfully');
            //xét độ dài của send data để check login
            // res.send('Login with '+user);
        }
    } catch (error) {
        res.status(500).send(error);
    }
}catch (e) {
    res.send('Loi khi signup: ' + e.message)
}

    });

//CART
app.post('/getallorder', async (req, res) => {
  let idclientorder=req.body.idclient;
  console.log('Tai khoan: '+idclientorder);
  let dating=await DataCart.find({makhdh:idclientorder});
  res.send(dating);
});

app.post('/order', async (req, res) => {
    try{
        const orderproduct = new DataCart({

            name: req.body.nameproduct,
            ingredient: req.body.ingredientproduct,
            price: req.body.priceproduct,
            image: req.body.imagesdh,
            makhdh:req.body.idclient
        });
        console.log(req.body.nameproduct, req.body.ingredientproduct, req.body.priceproduct, req.body.imagesdh,req.body.idclient);
        try {
            const orders = await orderproduct.save();
            if (!orders) {
                res.send('Invalid product order !')
            } else {
                res.send('Order Successfully');
                //xét độ dài của send data để check login
                // res.send('Login with '+user);
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }catch (e) {
        res.send('Loi khi order: ' + e.message)
    }
});

app.post('/deleteorder', async (req, res) => {
    var idcart = req.body.idcart;
    console.log(idcart);
    try {
        const deletecart = await DataCart.findByIdAndDelete(idcart);
        if (!deletecart) {
            res.send('Khong tin thay gia tri')
        } else {
            res.send('Xóa thành công');
        }
    } catch (e) {
        res.send('Loi khi delete order ' + e.message)
    }
});

//PRODUCT

app.post('/update', function (req, res) {
    var idProduct = req.body.id;
    var nameProduct = req.body.name;
    var priceProduct = req.body.price;
    var ingredientProduct = req.body.ingredient;
    res.render('update', {idProduct, nameProduct, priceProduct, ingredientProduct});
});

app.post('/updateNew', upload.single('avatar'), async (req, res) => {
    var idn = req.body.idNew;
    var namen = req.body.nameNew;
    var pricen = req.body.priceNew;
    var ingredientn = req.body.ingredientNew;
    var linkimagen = '../uploads/' + req.file.filename;
    var linkpathn = req.file.path;
    try {
        const stt = await DataProduct.findByIdAndUpdate(idn, ({
            name: namen,
            price: pricen,
            ingredient: ingredientn,
            image: linkimagen,
        }));
        if (!stt) {
            res.end("Khong tim thay");
        } else {
            res.redirect('/')
        }
    } catch (e) {
        res.send('Loi khi update: ' + e.message)
    }
});

app.post('/delete', async (req, res) => {
    var id_delete = req.body.id;
    console.log(id_delete);
    try {
        const de = await DataProduct.findByIdAndDelete(id_delete);
        if (!de) {
            res.send('Khong tin thay gia tri')
        } else {
            res.redirect('/')
        }
    } catch (e) {
        res.send('Loi khi delete product ' + e.message)
    }
});

app.post('/add', function (req, res) {
    res.render('add')
});

// upload nhiều file cùng một lúc,truyền name của thẻ input
//let up2 = multer({storage: storage}).array('avatar', 3);

// upload một file dùng single
app.post('/addNew', upload.single('avatar'), async (req, res) => {


    try {
        var nameadd = req.body.name_p;
        var priceadd = req.body.price_p;
        var ingredientadd = req.body.ingredient_p;
        var linkimage = '../uploads/' + req.file.filename;
        var linkpath = req.file.path;
        console.log('Gia tri: ' + linkimage + '\n' + linkpath);
        const data = new DataProduct({
            name: nameadd,
            price: priceadd,
            ingredient: ingredientadd,
            image: linkimage

        });
        try {
            await data.save();
            res.redirect('/');
        } catch (e) {
            res.send('Loi khi them ' + e.message);
        }
    } catch (e) {
        res.send('Loi khi add: ' + e.message);
        console.log(e.message)
    }
});
module.exports = app;