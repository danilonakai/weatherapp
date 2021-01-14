var id = 0;
var locations_list = [];

function call_api(location){
    const apiKey = "25a16ac541e17d47433f5c0654f3be66";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

    return fetch(url).then(function(response){
        return response;
    }).catch(function(error){
        console.log('There has been a problem with your fetch operation: ' + error.message);
    });
}

function register_location(location){
    call_api(location).then(function(response){
        if(response.status === 200){
            locations_list.push({id:id,title:location});

            id++;
            update_content();
        }else{
            console.log('Network response was not ok.');
        }
    });
}

function delete_location(id){
    let delete_item;

    $(locations_list).each(function(e){
        if(locations_list[e].id == id){
            delete_item = e;
        }
    });

    locations_list.splice(delete_item,1);

    update_content();
}

function generate_card(id,title,temperature,img,country,description){
    let result = '<div class="card"><div class="title"><h2>'+
            title+' - '+country+
            '</h2><i class="fas fa-times" onclick="delete_location('+id+')"></i></div><div class="info"><span class="temperature">'+
            temperature+
            '°C</span><figure><img src="http://openweathermap.org/img/wn/'+img+'@2x.png" alt=""><figcaption>'+description+
            '</figcaption></figure></div></div>';
    
    return result;
}

function update_content(){
    let output_content = "";
    asyncForEach(locations_list, async function(location){
        await call_api(location.title).then(function(response){
            return response.json();
        }).then(function(response){
            let id = location.id;
            let title = response.name; // title
            let temperature = Math.round(response.main.temp); //temperature
            let img = response.weather[0].icon; //img
            let description = response.weather[0].main; //description
            let country = response.sys.country;

            return generate_card(id,title,temperature,img,country,description);
        }).then(function(response){
            output_content = output_content + response;
            $(".content").html(output_content);
            return;
        });
    });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
  

$('#add_location').click(function(e){
    e.preventDefault();
    
    register_location($("#location").val());

    $("#location").val("");
});