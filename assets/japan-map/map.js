/* Prefecture codes follow the map's data-code attributes (1–47).
   Future article URLs can be connected in selectPrefecture(). */
const regions = [
  ["Hokkaido", 1], ["Tohoku", 7], ["Kanto", 14], ["Chubu", 23],
  ["Kansai", 30], ["Chugoku", 35], ["Shikoku", 39], ["Kyushu & Okinawa", 47]
];
const names = [
  ["Hokkaido","北海道"],["Aomori","青森県"],["Iwate","岩手県"],["Miyagi","宮城県"],
  ["Akita","秋田県"],["Yamagata","山形県"],["Fukushima","福島県"],["Ibaraki","茨城県"],
  ["Tochigi","栃木県"],["Gunma","群馬県"],["Saitama","埼玉県"],["Chiba","千葉県"],
  ["Tokyo","東京都"],["Kanagawa","神奈川県"],["Niigata","新潟県"],["Toyama","富山県"],
  ["Ishikawa","石川県"],["Fukui","福井県"],["Yamanashi","山梨県"],["Nagano","長野県"],
  ["Gifu","岐阜県"],["Shizuoka","静岡県"],["Aichi","愛知県"],["Mie","三重県"],
  ["Shiga","滋賀県"],["Kyoto","京都府"],["Osaka","大阪府"],["Hyogo","兵庫県"],
  ["Nara","奈良県"],["Wakayama","和歌山県"],["Tottori","鳥取県"],["Shimane","島根県"],
  ["Okayama","岡山県"],["Hiroshima","広島県"],["Yamaguchi","山口県"],["Tokushima","徳島県"],
  ["Kagawa","香川県"],["Ehime","愛媛県"],["Kochi","高知県"],["Fukuoka","福岡県"],
  ["Saga","佐賀県"],["Nagasaki","長崎県"],["Kumamoto","熊本県"],["Oita","大分県"],
  ["Miyazaki","宮崎県"],["Kagoshima","鹿児島県"],["Okinawa","沖縄県"]
];
const prefectures = names.map(([name, japanese], index) => ({
  code: index + 1, name, japanese, region: regions.find(([, end]) => index + 1 <= end)[0]
}));
const map = document.querySelector("#map");
const list = document.querySelector("#prefecture-list");
const search = document.querySelector("#search");
let selectedCode = null;

function selectPrefecture(code) {
  const prefecture = prefectures.find(item => item.code === code);
  if (!prefecture) return;
  selectedCode = code;
  document.querySelector("#selection-region").textContent = prefecture.region.toUpperCase();
  document.querySelector("#selection-name").textContent = prefecture.name;
  document.querySelector("#selection-japanese").textContent = prefecture.japanese;
  document.querySelector("#selection-note").textContent = "Prefecture selected. Stories will be added here in the future.";
  document.querySelectorAll("[data-code][aria-pressed]").forEach(element => {
    element.setAttribute("aria-pressed", String(Number(element.dataset.code) === code));
  });
}

function renderList() {
  const query = search.value.trim().toLocaleLowerCase();
  const matches = prefectures.filter(item =>
    item.name.toLocaleLowerCase().includes(query) ||
    item.japanese === query || item.japanese.replace(/[都府県]$/, "").includes(query)
  );
  list.replaceChildren();
  let lastRegion = "";
  matches.forEach(item => {
    if (lastRegion !== item.region) {
      const heading = document.createElement("h3");
      heading.className = "region-title";
      heading.textContent = item.region;
      list.append(heading);
      lastRegion = item.region;
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "prefecture-button";
    button.dataset.code = item.code;
    button.setAttribute("aria-pressed", String(item.code === selectedCode));
    const english = document.createElement("span");
    english.textContent = item.name;
    const japanese = document.createElement("span");
    japanese.lang = "ja";
    japanese.textContent = item.japanese;
    button.append(english, japanese);
    button.addEventListener("click", () => selectPrefecture(item.code));
    list.append(button);
  });
  document.querySelector("#result-count").textContent = matches.length
    ? `${matches.length} of 47 prefectures`
    : "No prefectures found. Try another name.";
}

async function loadMap() {
  try {
    const response = await fetch("assets/japan-map/japan.svg");
    if (!response.ok) throw new Error(`Map request failed: ${response.status}`);
    const parsed = new DOMParser().parseFromString(await response.text(), "image/svg+xml");
    if (parsed.querySelector("parsererror")) throw new Error("Invalid map SVG");
    const svg = document.importNode(parsed.documentElement, true);
    svg.setAttribute("role", "group");
    svg.setAttribute("aria-label", "Japan: select one of 47 prefectures");
    const shapes = [...svg.querySelectorAll(".prefecture")];
    if (shapes.length !== 47) throw new Error("Incomplete prefecture map");
    shapes.sort((a, b) => Number(a.dataset.code) - Number(b.dataset.code)).forEach(shape => {
      const item = prefectures[Number(shape.dataset.code) - 1];
      shape.setAttribute("role", "button");
      shape.setAttribute("tabindex", "0");
      shape.setAttribute("aria-label", `${item.name} / ${item.japanese}`);
      shape.setAttribute("aria-pressed", String(item.code === selectedCode));
      shape.addEventListener("click", () => selectPrefecture(item.code));
      shape.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectPrefecture(item.code);
        }
      });
      // Match the visual map's tab order to the directory's prefecture-code order.
      shape.parentNode.append(shape);
    });
    map.replaceChildren(svg);
  } catch (error) {
    map.textContent = "The map could not load. You can still choose any prefecture from the list.";
    console.error(error);
  } finally {
    map.setAttribute("aria-busy", "false");
  }
}
search.addEventListener("input", renderList);
renderList();
loadMap();
