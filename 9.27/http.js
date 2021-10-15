let  http = require('http');
let url = require("url");
let querystring = require("querystring");
let MongoClient = require("mongodb").MongoClient;
let mongoUrl = "mongodb://admin:123456@127.0.0.1:27017/admin";
http.createServer((req,res) =>{
    var post = "";
    res.setHeader('Content-Type','application/json');
    res.setHeader('Access-Control-Allow-Origin','*');
    req.on("data",function (chunk) {
        post += chunk;
    });
    req.on("end",function () {
        if(req.method == "GET"){
            post = url.parse(req.url).query;
        }
        post = querystring.parse(post);
        let resData;
        MongoClient.connect(mongoUrl,{useNewUrlParser:true},function (err,db) {
            if (err) throw err;
            let dbase = db.db("abc");
            let reg = /^[A-Za-z0-9]{6,12}$/;
            switch (post.num){
                case "0":{
                    let whereStr = {name:post.str1};
                    dbase.collection("user").find(whereStr).toArray(function (err,result) {
                        if(err)throw err;
                        if(reg.test(post.str1))
                        {
                            if(result.length == 1) {
                                resData ={
                                    err_type:0
                                };
                            }else if(result.length == 0) {
                                resData ={
                                    err_type:2
                                };
                            }
                        }else{
                            resData ={
                                err_type:1
                            };
                        }
                        db.close();
                        res.end(JSON.stringify(resData));
                    });
                    break;
                }
                case "1":{
                    if(reg.test(post.str1)) {
                        resData ={
                            err_type:4
                        };
                    }else{
                        console.log("1");
                        resData ={
                            err_type:3
                        };
                    }
                    db.close();
                    res.end(JSON.stringify(resData));
                    break;
                }
                case "2":{
                    if(reg.test(post.str3)){
                        if(post.str2 == post.str3) {
                            resData ={
                                err_type:7
                            };
                        }else{
                            resData ={
                                err_type:5
                            };
                        }
                    }else{
                        resData ={
                            err_type:6
                        };
                    }
                    db.close();
                    res.end(JSON.stringify(resData));
                    break;
                }
                case "3":{
                    let myobj = {name:post.str1,pwd:post.str2};
                    dbase.collection("user").insertOne(myobj,function (err,res) {
                        if(err)throw err;
                        console.log("文档插入成功！");
                        db.close();
                    });
                    resData ={
                        err_type:8
                    };
                    res.end(JSON.stringify(resData));
                    break;
                }
                default:break;
            }
        });
    });
}).listen(3003);