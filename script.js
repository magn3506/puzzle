document.addEventListener("DOMContentLoaded", init);

//GLOBAL VIABLES
let imageAddress =
  "https://thumbs-prod.si-cdn.com/c3phl1TZgQ92bLQugItmtovLZhs=/fit-in/1600x0/https://public-media.si-cdn.com/filer/54/10/5410da58-2295-4e3a-a847-fecd41cdcdd9/scarlet_tanager.jpg";
let columns = 2;
let rows = 2;

let imageHeight;
let imageWidth;
let dragged;

function init() {
  console.log("init");
  loadImage();
  // EVENTLISTENERS
  document.querySelector(".image").addEventListener("input", getImageUrl);
  document
    .querySelector(".input_columns")
    .addEventListener("input", getColumnsInput);
  document.querySelector(".input_rows").addEventListener("input", getRowsInput);
  document.querySelector(".mk_puzzle").addEventListener("click", mkDropZone);
}

// GET NEW INPUT FROM IMAGE URL WHEN DETECTING A CHANGE IN INPUT FIELDS
//---------------------------------------------------------------------
//----------GETS VALUES FROM INPUT FIELDS-------------------------------

function getImageUrl() {
  imageAddress = document.querySelector(".image").value;
  loadImage();
}
function getColumnsInput() {
  columns = document.querySelector(".input_columns").value;
  loadImage();
}
function getRowsInput() {
  rows = document.querySelector(".input_rows").value;
  loadImage();
}
//---------------------------------------------------------------------
//---------------------------------------------------------------------
//---------------------------------------------------------------------

// LOADS IMAGE AND FINT NATURAL HEIGHT AND WIDHT
//---------------------------------------------------------------------
//---------------------------------------------------------------------
function loadImage() {
  document.querySelector("img").src = imageAddress;

  //   SETS GET IMAGE H + W
  imageHeight = document.querySelector("img").height;
  imageWidth = document.querySelector("img").width;
}

//---------------------------------------------------------------------
//---------------------------------------------------------------------

// 2D LOOP CREATES GRID DEPENDING OF HEIHT, WIDTH, AND INPUT OPTIONS FROM ROWS AND COLUMNS
//---------------------------------------------------------------------

function mkDropZone() {
  // SETS NUMBER OF 1fr COLUMS
  let dropZoneCon = document.querySelector(".drop_zone_con");
  dropZoneCon.innerHTML = "";
  dropZoneCon.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  dropZoneCon.style.width = `${imageWidth}px`;

  //   2D loop
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      let frame = document.createElement("div");
      frame.style.height = imageHeight / rows + "px";

      //   frame.textContent = `${x}${y}`;

      // frame.draggable = true;
      frame.dataset.xyid = `id${x}${y}`;

      frame.classList.add("frame");

      document.querySelector(".drop_zone_con").appendChild(frame);
    }
  }

  mkPuzzlePieces();
}

//---------------------------------------------------------------------
//---------------------------------------------------------------------

// 2D LOOP THAT CREATES SCATTERED frame DANOMLY
//---------------------------------------------------------------------
//---------------------------------------------------------------------

function mkPuzzlePieces() {
  let puzzlePiecesCon = document.querySelector(".pieces_con");
  puzzlePiecesCon.innerHTML = "";
  // first loop y
  for (let y = 0; y < rows; y++) {
    //second loop x
    for (let x = 0; x < columns; x++) {
      let piece = document.createElement("div");
      let h = (piece.style.height = imageHeight / rows + "px");
      let w = (piece.style.width = imageWidth / columns + "px");
      // position x & y * 100 = pX & pY
      let pX = x * 100;
      let pY = y * 100;
      // makes piece draggable
      piece.draggable = true;
      //scatter the piece when printet
      piece.style.left = `${Math.random() * 200 + 400}px`;
      piece.style.top = `${Math.random() * 300 + 300}px`;
      //sets background image, size and position for each(dependent on the values of x and y se pX & pY)
      piece.style.backgroundImage = `url(${imageAddress})`;
      piece.style.backgroundSize = `${columns * 100}% ${rows * 100}%`;
      piece.style.backgroundPosition = `${columns * 100 - pX}% ${rows * 100 -
        pY}%`;

      //GIVES THE PIECE/DIV AN COSTUM DATA-ATRRIBUTE
      piece.dataset.xyid = `id${x}${y}`;

      //ADDS A CLASS OF PIECE
      piece.classList.add("piece");
      // piece.classList.add(`piece${x}`);

      // PRINTS THE ELEMENT TO THE PIECES CONTAINER
      document.querySelector(".pieces_con").appendChild(piece);
      dragNdrop();
    }
  }
}
//---------------------------------------------------------------------
//---------------------------------------------------------------------

// DRAG N DROP//-------------------------------------------------------
//---------------------------------------------------------------------

function dragNdrop() {
  /* events fired on the draggable target */
  document.addEventListener("drag", function(event) {});
  document.addEventListener("dragstart", function(event) {
    // store a ref. on the dragged elem
    dragged = event.target;

    // make it half transparent
    event.target.style.opacity = 0.5;
  });
  document.addEventListener("dragend", function(event) {
    // reset the transparency
    event.target.style.opacity = "";
  });
  /* events fired on the drop targets */
  document.addEventListener("dragover", function(event) {
    // prevent default to allow drop
    event.preventDefault();
  });

  document.addEventListener("drop", function(event) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    console.log("DROP", event.target.className);
    // move dragged elem to the selected drop target
    if (event.target.className == "frame") {
      event.target.style.background = "";
      dragged.parentNode.removeChild(dragged);
      event.target.appendChild(dragged);
      dragged.style.left = event.target.style.left;
      dragged.style.top = event.target.style.top;

      // GETS DATA ATTRIBUTE
      let eventId = event.target.getAttribute("data-xyid");
      let draggedId = dragged.getAttribute("data-xyid");
      // IF BOTH MATHES
      if (eventId == draggedId) {
        smallSucces();
      }
    } else if (event.target.className == "theBody") {
      // park the dragged elem somewhere on the body
      dragged.style.left = event.pageX + "px";
      dragged.style.top = event.pageY + "px";
    }
  });
}

function smallSucces() {
  document.querySelector(".goodJob").play();
  document.querySelector(".goodJob").duration = 100;

  let sumOfFrames = document.querySelectorAll(".frame");
  let sumOfCorrectFrames = 0;

  for (let i = 0; i < sumOfFrames.length; i++) {
    let tjek = sumOfFrames[i].hasChildNodes();
    if (tjek == true) {
      sumOfCorrectFrames++;
    }
  }

  let totalBoxes = rows * columns;

  if (totalBoxes == sumOfCorrectFrames) {
    greatSucces();
  }
}

function greatSucces() {
  console.log("MEGA FEEEST");
  document.querySelector(".celebrate").play();
  document.querySelectorAll(".piece").forEach(el => {
    el.style.outline = "10px solid transparent";
    el.style.transition = "2s";
  });
  document.querySelectorAll(".frame").forEach(el => {
    el.style.outline = "10px solid transparent";
    el.style.transition = "2s";
  });
}
