document.addEventListener("DOMContentLoaded", init);

const user_colors = JSON.parse(localStorage.getItem("colors")) || [];
// ul
const colors = document.getElementById("colors");
function init() {
  if (localStorage.getItem("colors")) {
    drawColor();
  }
  // elements
  const btnChooseColor = document.getElementById("button_choose_color");

  // button choose color
  btnChooseColor.addEventListener("click", chooseColor);

  //   clear
  document.getElementById("clear").addEventListener("click", clearAllColor);
}

// function => choose color
async function chooseColor() {
  document.body.style.cssText = `display:none;`;
  try {
    // eye dropper
    const eye = new EyeDropper();
    const result = await eye.open();
    const color = result.sRGBHex;

    // check color
    const check_color = user_colors.find((c) => c === color);

    if (check_color) {
      document.body.style.cssText = `display:grid;`;
      return false;
    }
    // check color

    // push color and run fn draw color
    user_colors.push(color);
    drawColor(user_colors);
    localStorage.setItem("colors", JSON.stringify(user_colors));
    document.body.style.cssText = `display:grid;`;
  } catch (error) {
    console.log(error);
    document.body.style.cssText = `display:grid;`;
  }
}

// draw colors
function drawColor(arr = JSON.parse(localStorage.getItem("colors")) || []) {
  colors.innerHTML = "";
  const colors_choosed = arr.map((color) => {
    return `<li class="color" >
        <div style='background-color:${color}; box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
    '  class="box-color"></div>
        <p data-color=${color} >${color}</p>
      </li>`;
  });

  colors.insertAdjacentHTML("beforeend", colors_choosed.join(""));

  document.querySelectorAll(".colors .color").forEach((color) => {
    color.addEventListener("click", copierColor);
  });
}

// copierColor
async function copierColor(e) {
  const color = e.currentTarget.querySelector("p");
  // change text content
  color.textContent = "Copied";

  // 500ms => copier => chnage text
  setTimeout(async () => {
    try {
      await navigator.clipboard.writeText(color.dataset.color);
      color.textContent = color.dataset.color;
    } catch (error) {
      console.log(error);
    }
  }, 500);
}

// clearAllColor
function clearAllColor() {
  colors.innerHTML = "";
  user_colors.length = 0;
  localStorage.removeItem("colors");
}
