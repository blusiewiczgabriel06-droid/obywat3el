// assets/shared.js
(function () {
  const raw = localStorage.getItem("mobywatel_user");
  if (!raw) return;

  const u = JSON.parse(raw);

  const map = {
    // SERIE
    "mdow_series": u.seria,
    "doc_series": u.seria,

    // DATY
    "issue_date": u.wydanie,
    "doc_issue": u.wydanie,
    "expiry_date": u.waznosc,
    "doc_expiry": u.waznosc,

    // PODSTAWOWE DANE
    "name": u.imie,
    "surname": u.nazwisko,
    "birthday": u.data,
    "pesel": u.pesel,
    "nationality": u.obywatelstwo,

    // RODZICE
    "father_name": u.ojciec,
    "mother_name": u.matka,

    // DODATKOWE
    "familyName": u.rodowe,
    "fathersFamilyName": u.rodoweOjca,
    "mothersFamilyName": u.rodoweMatki,
    "birthPlace": u.miejsce,
    "countryOfBirth": u.kraj,
    "adress": `${u.ulica || ""} ${u.kod || ""} ${u.miasto || ""}`,
  };

  Object.keys(map).forEach(id => {
    const el = document.getElementById(id);
    if (el && map[id]) el.textContent = map[id];
  });

  // ZDJĘCIE
  if (u.photo) {
    const img = document.querySelector(".id_own_image");
    if (img) img.style.backgroundImage = `url("${u.photo}")`;
  }
})();
