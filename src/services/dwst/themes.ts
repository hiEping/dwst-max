/** 主题配置数据结构类型 */
export type ThemeConfigProp = {
  "name": string,
  "beautyName": string,
  "active": boolean,
  "theme": {
      "algorithm": string[],
      "token": any
  }
}

/** 获取所有主题配置 /public/themes.json */
export async function getThemes() {
  const themes = await
  fetch("/themes.json")
  .then(function(response) {
    if (response.ok) {
      return response.json();
    }
    // throw new Error("Network response was not ok.");
    return {
      success: false,
      data: {"Error": "Network response was not ok."},
      errorCode: -1,
    }  
  })
  .then(function(data: ThemeConfigProp[]) {
    // 对返回的JSON数据进行处理
    return {
      success: true,
      data: data,
      errorCode: 0,
    }
  })
  .catch(function(error) {
    return {
      success: false,
      data: {"Error": error.message},
      errorCode: -2,
    }  
  });
  return themes;
}

/** 从/public/themes.json, 获取配置文件中默认的主题配置（active=true）, 如果没有配置默认则取第一个配置。 */
export async function getActiveTheme() {
  const theme = 
  fetch('/themes.json')
  .then((response)=>{
    if (response.ok) {
      return response.json();
    }
    return {
      success: false,
      data: {"Error": "Network response was not ok."},
      errorCode: -1,
    }
  })
  .then((data: ThemeConfigProp[])=>{
    for (let i=0; i<data.length; i++) {
      if (data[i].active) {
        return {
          success: true,
          data: data[i],
          errorCode: 0,
        };
      }
    }
    return {
      success: true,
      data: data[0],
      errorCode: 0,
    }
  })
  .catch((error) => {
    return {
      success: false,
      data: {"Error": error.message},
      errorCode: -2
    }
  })
  return theme;
}