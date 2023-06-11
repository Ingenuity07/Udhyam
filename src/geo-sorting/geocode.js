
const request = require('request')
const http = require('http');
const https = require('https');


function fetchData(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        let data = '';
  
        response.on('data', (chunk) => {
          data += chunk;
        });
  
        response.on('end', () => {
          resolve(data);
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
  }


const geocode = async  (address) => {

    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=pk.eyJ1IjoiaW5nZW51aXR5MDciLCJhIjoiY2t0bzIzZjk4MDJldjJ2bDhtMjJ5cWlrdiJ9.ljNvD1GPoaIa2pvXCkh0QQ&limit=1"
    let result = {}
    return fetchData(url)
    .then((data) => {
        return JSON.parse(data);
    })
    .then((data) => {
    
    
    return {
        lat : data.features[0].geometry.coordinates[0],
        long : data.features[0].geometry.coordinates[1]
    }
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      // Handle the error appropriately
    });

    return res
}


module.exports =geocode; 