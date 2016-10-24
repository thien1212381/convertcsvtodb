var mysql     =   require('mysql')
var config    =   require('./configtest.json')
var fs        =   require('fs')
var csvWriter =   require('csv-write-stream')
var async     =   require('async')
var connection = mysql.createConnection({
  host      : config.host,
  port      : config.port,
  user      : config.user,
  password  : config.password,
  database  : config.database_name
});
connection.connect(function(err){
  console.log(err);
  console.log("Connection!!!!");
});
/*connection.query('SELECT * FROM tbtt_user',function(err,result){
  var tables = JSON.parse(JSON.stringify(result));
  var writer = csvWriter();
  writer.pipe(fs.createWriteStream('result.csv',{defaultEncoding:'utf8'}));
  for (table of tables)
  {
    console.log(table);
    writer.write(table);
  }
})*/
console.time('timer');
connection.query("show tables",function(err,result){
  var tables = JSON.parse(JSON.stringify(result));
  async.forEach(tables,function(table,callback){
    var table_name = table.Tables_in_tshopdn;
    var queryHeader = "SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`="
                      + "'" + config.database_name + "'"
                      + " AND `TABLE_NAME`="
                      + "'" + table_name + "'";
    var querySelect = "SELECT * FROM " + table_name;
    connection.query(querySelect,function(err,result){
      var tables = JSON.parse(JSON.stringify(result));
      var writer = csvWriter();
      writer.pipe(fs.createWriteStream(table_name+'.csv',{defaultEncoding:'utf8'}));
      for (table of tables)
      {
        console.log(table);
        writer.write(table);
      }
      callback();
    })
  },function(err){
    if(err) console.log(err);
    connection.end();
    console.timeEnd('timer');
  })
})
/*connection.query("show tables",function(err,result){
  var tables = JSON.parse(JSON.stringify(result));
  async.forEach(tables,function(table,callback){
    var table_name = table.Tables_in_tshopdn;
    var queryHeader = "SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`="
                      + "'" + config.database_name + "'"
                      + " AND `TABLE_NAME`="
                      + "'" + table_name + "'";
    var querySelect = "SELECT * INTO OUTFILE 'C:\\\\Users\\\\Thien. Lam Phuoc\\\\Desktop\\\\convertdbtocsv\\\\"+table_name+".csv' CHARACTER SET utf8 FIELDS TERMINATED BY ',' LINES TERMINATED BY '\\n' FROM "+table_name;
    console.log(querySelect);
    connection.query(querySelect,function(err){
      //if(err) console.log(err);
      //console.log('OK');
      callback();
    })
  },function(err){
    if(err) console.log(err);
    connection.end();
    console.timeEnd('timer');
  })
})*/
