// form태그 골라서 submit할때 json fetch함수실행
const $input = document.querySelector("input");
let $container = document.querySelector(".container");
const $total = document.querySelector(".total");
const $content = document.querySelector(".content");
const $inner = document.createElement("div");
// const $inPut = document.querySelector(".input");
let timeout;

let imageArray = [];
let imageCount = 0;
let totalImage = 0;
let imagePage = 1;
let totalArray = 0;

// 이미지업로드 스크롤
function imageLoaded() {
  imageCount++;
  console.log("count: ", imageCount);
  // console.log("Array: ", totalArray);
  if (imageCount === totalArray) {
    console.log("ready");
    imagePage += 1;
  }
}

const onInput = async function (e) {
  // e.preventDefault();

  if ($input.value === "") {
    window.location.reload();
  }
  console.log("page", imagePage);
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    const movies = await fetchData($input.value);

    console.log("movies!!!: ", movies);

    if (movies.totalResults > 0) {
      $total.innerHTML = `
      <div>${$input.value}의 총합:${movies.totalResults}</div>
      `;
    }
    $content.prepend($total);

    for (let movie of movies.Search) {
      const imgSrc =
        movie.Poster === "N/A"
          ? "asd.jpeg"
          : movie.Poster.replace("SX300", "SX700");
      imageCount = 0;
      totalArray = movies.Search.length;

      const option = document.createElement("a");
      const li = document.createElement("li");
      li.setAttribute("class", "list");
      const img = document.createElement("img");
      const $div = document.createElement("div");
      $div.textContent = `${movie.Title} (${movie.Year})`;
      img.setAttribute("src", imgSrc);

      // image infor
      const $imginfo = document.createElement("div");
      $imginfo.setAttribute("class", "hidden");
      const $imgActor = document.createElement("h1");
      const $imgAwd = document.createElement("div");
      const $imgCtr = document.createElement("div");
      const $imgplot = document.createElement("p");
      const $imgPoster = document.createElement("img");
      const $hiddendiv = document.createElement("div");
      const $header = document.createElement("header");
      $hiddendiv.setAttribute("class", "list--div");
      li.append(img);
      li.append($div);
      li.append($imginfo);
      // option.append(li);
      // 이미지업로드 갯수세기
      img.addEventListener("load", imageLoaded);

      $inner.append(option);

      // 내용비동기
      async function a() {
        const r = await onMovieSelect(movie.imdbID);
        console.log("r", r);
        $imgPoster.setAttribute(
          "src",
          r.Poster === "N/A" ? "asd.jpeg" : r.Poster.replace("SX300", "SX700")
        );
        $imgActor.textContent = `Title: ${r.Title}`;
        $imgAwd.textContent = `Awards: ${r.Awards}`;
        $imgCtr.textContent = `Country: ${r.Country}`;
        $imgplot.textContent = `Plot: ${r.Plot}`;

        $hiddendiv.append($imgActor, $imgAwd, $imgCtr, $imgplot);
        $imginfo.append($hiddendiv);
      }
      a();
      option.append(li);
    }
    $container.append($inner);
  }, 1000);
};

const onMovieSelect = async (movie) => {
  const response = await axios({
    url: "https://www.omdbapi.com",
    params: {
      apikey: "7035c60c",
      i: movie,
    },
    methods: "get",
  });
  return response.data;
};

// fetchData
const fetchData = async function (e) {
  const response = await axios({
    url: "https://www.omdbapi.com",
    params: {
      apikey: "7035c60c",
      s: e,
      page: imagePage,
    },
    methods: "get",
  });
  if (response.data.Error) {
    alert("없는 영화임");
  }

  console.log("data: ", response);
  return response.data;
};

// start
$input.addEventListener("input", onInput);

// scroll
window.addEventListener("scroll", (e) => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 1000
  ) {
    onInput();
  }
});
