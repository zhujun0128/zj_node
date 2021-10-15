const http = require("http");
const querystring = require("querystring");
const  MongoClient = require("mongodb").MongoClient;
const  mongoUrl = "mongodb://admin:123456@127.0.0.1:27017/admin";
const  server = http.createServer(function (req,res) {
    res.statusCode = 200;
    res.setHeader("Content-Type","application/json");
    res.setHeader("Access-Control-Allow-Origin","*");
    let post = "";
    let data = {};
    let usernameResult = {};
    let submitResult = {};
    req.on("data",(chunk)=>{
        post += chunk;
    });
    req.on("end",()=>{
        data = querystring.parse(post);
        MongoClient.connect(mongoUrl,{useNewUrlParser:true},(err,db)=>{
            if(err) throw err;
            console.log("数据库已创建");
            let dbase = db.db("regist");
            /*查询数据*/
            let whereStr = {username:data.username};
            dbase.collection("userinfo").find(whereStr).toArray((err,result)=>{
                if(err) throw err;
                if(!result.length){
                    /*用户名不在数据库里*/
                    usernameResult = {
                        result:"用户名合法",
                        flag:1
                    }
                } else {
                    /*用户名在数据库里*/
                    usernameResult = {
                        result:"用户名重复",
                        flag:0
                    }
                }
                if(data.info == "submit"){
                    if(usernameResult.flag == 1){
                        dbase.collection("userinfo").insertOne(data,(err,res1)=>{
                            if(err) throw err;
                            submitResult = {
                                result:"插入成功",
                                flag:1
                            };
                            res.end(JSON.stringify(submitResult));
                            db.close();
                        });
                    } else {
                        submitResult = {
                            result:"插入失败",
                            flag:1
                        };
                        res.end(JSON.stringify(submitResult));
                    }
                }
                if(data.info == "find"){
                    res.end(JSON.stringify(usernameResult));
                }
            })
        })
    });
}).listen(3000);