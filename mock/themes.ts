export default {
  'GET /api/themes': (_req: any, res: any) => {    
    fetch("themes.json")
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
      // throw new Error("Network response was not ok.");
      // console.log("Network response was not ok.");
      res.json({
        success: false,
        data: {"Error": "Network response was not ok."},
        errorCode: -1,
      });      
    })
    .then(function(data) {
      // 对返回的JSON数据进行处理
      console.log(data);
      res.json({
        success: true,
        data: data,
        errorCode: 0,
      });
    })
    .catch(function(error) {
      // console.log("Error:", error.message);
      res.json({
        success: false,
        data: {"Error": error.message},
        errorCode: -2,
      });      
    });
  },
};
