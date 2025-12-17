
var confirmElement = document.querySelector(".confirm");

function closePage(){
  clearClassList();
}

function openPage(page){
  clearClassList();
  var classList = confirmElement.classList;
  classList.add("page_open");
  classList.add("page_" + page + "_open");
}

function clearClassList(){
  var classList = confirmElement.classList;
  classList.remove("page_open");
  classList.remove("page_1_open");
  classList.remove("page_2_open");
  classList.remove("page_3_open");
}

var time = document.getElementById("time");
var options = { year: 'numeric', month: 'numeric', day: '2-digit' };
var optionsTime = { second: 'numeric', minute: 'numeric', hour: '2-digit' };

if (localStorage.getItem("update") == null){
  localStorage.setItem("update", "21.05.2025")
}

var date = new Date();

var updateText = document.querySelector(".bottom_update_value");
updateText.innerHTML = localStorage.getItem("update");

var update = document.querySelector(".update");
update.addEventListener('click', () => {
  var newDate = date.toLocaleDateString("pl-PL", options);
  localStorage.setItem("update", newDate);
  updateText.innerHTML = newDate;

  scroll(0, 0)
});

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

if (time) {
  setClock();
}
function setClock(){
    if (!time) return;
    date = new Date();
    time.innerHTML = "Czas: " + date.toLocaleTimeString("pl-PL", optionsTime) + " " + date.toLocaleDateString("pl-PL", options);
    delay(1000).then(() => {
        setClock();
    })
}

var unfold = document.querySelector(".info_holder");
if (unfold){
  unfold.addEventListener('click', () => {
    if (unfold.classList.contains("unfolded")){
      unfold.classList.remove("unfolded");
    }else{
      unfold.classList.add("unfolded");
    }
  })
}

var data = {}

var params = new URLSearchParams(window.location.search);
for (var key of params.keys()){
  data[key] = params.get(key);
}

var ownImgEl = document.querySelector(".id_own_image");
if (ownImgEl && data['image']) {
  ownImgEl.style.backgroundImage = `url(${data['image']})`;
}

var birthday = data['birthday'];
if (birthday){
  try{
    var birthdaySplit = String(birthday).split(".");
    var day = parseInt(birthdaySplit[0]);
    var month = parseInt(birthdaySplit[1]);
    var year = parseInt(birthdaySplit[2]);
    var birthdayDate = new Date();
    birthdayDate.setDate(day)
    birthdayDate.setMonth(month-1)
    birthdayDate.setFullYear(year)
    birthday = birthdayDate.toLocaleDateString("pl-PL", options);
    setData("birthday", birthday);
  }catch(e){ /* ignore */ }
}

var sex = (data['sex']||'').toString().toLowerCase();
if (sex === "m"){
  sex = "Mężczyzna"
}else if (sex === "k"){
  sex = "Kobieta"
} else {
  sex = '';
}

setData("name", (data['name']||'').toString().toUpperCase());
setData("surname", (data['surname']||'').toString().toUpperCase());
setData("nationality", (data['nationality']||'').toString().toUpperCase());
setData("familyName", data['familyName']);
setData("sex", sex);
setData("fathersFamilyName", data['fathersFamilyName']);
setData("mothersFamilyName", data['mothersFamilyName']);
setData("birthPlace", data['birthPlace']);
setData("countryOfBirth", data['countryOfBirth']);
setData("adress", "ul. " + data['adress1'] + "<br>" + data['adress2'] + " " + data['city']);
// First names of parents
setData("father_name", data['father_name'] || '');
setData("mother_name", data['mother_name'] || '');
// mDowód fields from gen.html
setData("mdow_series", data['mdow_series'] || '');
setData("expiry_date", data['expiry_date'] || '');
setData("issue_date", data['issue_date'] || '');
// Mirror for moreid.html if present
setData("doc_series", data['mdow_series'] || '');
setData("doc_expiry", data['expiry_date'] || '');
setData("doc_issue", data['issue_date'] || '');

if (localStorage.getItem("homeDate") == null){
  var homeDay = getRandom(1, 25);
  var homeMonth = getRandom(0, 12);
  var homeYear = getRandom(2012, 2019);

  var homeDate = new Date();
  homeDate.setDate(homeDay);
  homeDate.setMonth(homeMonth);
  homeDate.setFullYear(homeYear)

  localStorage.setItem("homeDate", homeDate.toLocaleDateString("pl-PL", options))
}

document.querySelector(".home_date").innerHTML = localStorage.getItem("homeDate")

try{
  if (birthday){
    if (parseInt(year) >= 2000){
      month = 20 + month;
    }
    var later;
    if ((sex||'').toLowerCase() === "mężczyzna"){
      later = "0295"
    }else{
      later = "0382"
    }
    if (day < 10){ day = "0" + day }
    if (month < 10){ month = "0" + month }
    var pesel = year.toString().substring(2) + month + day + later + "7";
    setData("pesel", pesel)
  }
}catch(e){ /* ignore on pages without these fields */ }

function setData(id, value){
  var el = document.getElementById(id);
  if (el != null && typeof value !== 'undefined') {
    el.innerHTML = value;
  }
}

function getRandom(min, max) {
  return parseInt(Math.random() * (max - min) + min);
}

// Activate bottom nav tab from query param ?tab=home|services|qr|more
(function(){
  try{
    var tab = (new URLSearchParams(window.location.search).get('tab')||'home').toLowerCase();
    var valid = ['home','services','qr','more'];
    if (!valid.includes(tab)) tab = 'home';
    var imgs = document.querySelectorAll('.bottom_element_image');
    var texts = document.querySelectorAll('.bottom_element_text');
    var openClasses = ['home_open','services_open','qr_open','more_open'];
    imgs.forEach(function(img){ openClasses.forEach(c=>img.classList.remove(c)); });
    texts.forEach(function(t){ t.classList.remove('open'); });
    document.querySelectorAll('.bottom_element_grid').forEach(function(el){
      var send = el.getAttribute('send');
      var img = el.querySelector('.bottom_element_image');
      var txt = el.querySelector('.bottom_element_text');
      if (send===tab){ if(img) img.classList.add(tab+'_open'); if(txt) txt.classList.add('open'); }
    });
  }catch(e){}
})();


// --- USER DATA (localStorage) ---
function formatDateToPL(value){
  if(!value) return "";
  // supports "YYYY-MM-DD" or "DD.MM.YYYY"
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y,m,d]=value.split("-");
    return `${d}.${m}.${y}`;
  }
  return value;
}

document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("mobywatel_user") || localStorage.getItem("xyzobywatel");
  if(!raw) return;
  let data;
  try { data = JSON.parse(raw); } catch(e){ return; }

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val ?? "";
  };

  setText("name", data.imie || "");
  setText("surname", data.nazwisko || "");
  setText("sex", data.plec || "");
  setText("birthday", formatDateToPL((data.dataUrodzenia || data.data) || ""));
  setText("pesel", data.pesel || "");
  setText("nationality", (data.obywatelstwo || "").toUpperCase());

  setText("mdow_series", data.seria || "");
  setText("issue_date", formatDateToPL(data.wydanie || ""));
  setText("expiry_date", formatDateToPL(data.waznosc || ""));

  setText("father_name", data.ojciec || "");
  setText("mother_name", data.matka || "");

  setText("familyName", data.rodowe || "");
  setText("fathersFamilyName", data.rodoweOjca || "");
  setText("mothersFamilyName", data.rodoweMatki || "");

  setText("birthPlace", data.miejsce || "");
  setText("countryOfBirth", data.kraj || "");

  const addrParts = [];
  if (data.ulica) addrParts.push(data.ulica);
  const cityLine = [data.kod, data.miasto].filter(Boolean).join(" ");
  if (cityLine) addrParts.push(cityLine);
  setText("adress", addrParts.join(", "));

  const ownImgEl = document.querySelector(".id_own_image");
  if (ownImgEl && data.photo) {
    ownImgEl.style.backgroundImage = `url("${data.photo}")`;
  }
});
