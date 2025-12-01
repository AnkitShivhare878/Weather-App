const apiKey="1c436a4ae63a0ad73059a91b4f43a82a";
const input=document.getElementById("input");
const searchBtn=document.getElementById("search");
const cityDisplay=document.getElementById("city");
const temperature=document.getElementById("temperature");
const clouds=document.getElementById("clouds");
const weatherImg=document.getElementById("img");
const templist=document.getElementById("templist");
const weekF=document.getElementById("weekF");

searchBtn.onclick=()=>{
  const city=input.value.trim()||"Patna";
  fetchWeather(city);
};

async function fetchWeather(city){
  try{
    const res=await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    if(!res.ok) throw new Error();
    const data=await res.json();
    updateCurrent(data);
    updateHourly(data);
    updateWeekly(data);
  }catch(e){
    alert("City not found");
  }
}

function updateCurrent(data){
  const current=data.list[0];
  cityDisplay.textContent=`${data.city.name}, ${data.city.country}`;
  temperature.textContent=`${Math.round(current.main.temp)} °C`;
  clouds.textContent=current.weather[0].description;
  weatherImg.src=`https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
}

function updateHourly(data){
  templist.innerHTML="";
  for(let i=1;i<=5;i++){
    const item=data.list[i];
    const time=new Date(item.dt*1000).toLocaleTimeString([],{
      hour:"2-digit",
      minute:"2-digit"
    });
    const div=document.createElement("div");
    div.className="card";
    div.innerHTML=`
      <p>${time}</p>
      <p>${Math.round(item.main.temp_max)} °C / ${Math.round(item.main.temp_min)} °C</p>
      <p>${item.weather[0].description}</p>
    `;
    templist.appendChild(div);
  }
}

function updateWeekly(data){
  weekF.innerHTML="";
  const days={};
  for(let i=0;i<data.list.length;i++){
    const d=new Date(data.list[i].dt*1000).toDateString();
    if(!days[d]&&Object.keys(days).length<4){
      days[d]=data.list[i];
    }
  }
  for(const d in days){
    const item=days[d];
    const div=document.createElement("div");
    div.className="week-card";
    div.innerHTML=`
      <p>${d}</p>
      <p>${Math.round(item.main.temp_max)} °C / ${Math.round(item.main.temp_min)} °C</p>
      <p>${item.weather[0].description}</p>
    `;
    weekF.appendChild(div);
  }
}

fetchWeather("Patna");
