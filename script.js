(function () {
  const main = document.getElementsByClassName("main")[0];
  const nsqrt = 10;
  const n = nsqrt * nsqrt; // grid size (nsqrt X nsqrt)
  const m = 10; // number of bombs
  const arr = [];
  const visitedSet = new Set(); // for determining win

  class Square {
    constructor(id) {
      this.value = 0;
      this.id = id;
      this.visited = false;
      this.div = document.createElement("div");
      this.div.className = "square";
      this.div.innerHTML = '&nbsp;'; // this.div.innerHTML = id;
      this.div.onclick = () => {
        if (this.value === "b") {
          this.div.innerHTML = 'X';
          this.div.className += " visited";
          this.div.style.backgroundColor = "orange";
          const text = document.createElement("div");
          text.innerText = 'game over!';
          main.appendChild(text);
          return;
        }
        showAround(this.id);
        this.showValue();
      }
    }
    showValue() {
      if (this.visited) return;
      this.visited = true;
      visitedSet.add(this.id);
      this.div.className += " visited";
      this.div.innerHTML = this.value;
      checkGame();
      if (this.value === 0) {
        this.div.innerHTML = '&nbsp;'; // this.div.innerHTML = '0';
        showAround(this.id).forEach(id => arr[id].showValue());
      }
    }
  }

  const showAround = (id) => {
    const around = []; // pushing only valid ids into the array
    // corners
    if (id === 0) { // top left
      around.push(id+1, id+nsqrt, id+nsqrt+1);
      return around;
    }
    if (id === nsqrt-1) { // top right
      around.push(id-1, id+nsqrt, id+nsqrt-1);
      return around;
    }
    if (id === n-nsqrt) { // bottom left
      around.push(id+1, id-nsqrt, id-nsqrt+1);
      return around;
    }
    if (id === n-1) { // bottom right
      around.push(id-1, id-nsqrt, id-nsqrt-1);
      return around;
    }
    // edges
    if (id % nsqrt === 0) { // left
      around.push(id+1, id-nsqrt, id-nsqrt+1, id+nsqrt, id+nsqrt+1);
      return around;
    }
    if (id % nsqrt === nsqrt - 1) { // right
      around.push(id-1, id-nsqrt, id-nsqrt-1, id+nsqrt, id+nsqrt-1);
      return around;
    }
    if (id < nsqrt) { // top
      around.push(id-1, id+1, id+nsqrt-1, id+nsqrt, id+nsqrt+1);
      return around;
    }
    if (id > n - nsqrt) { // bottom
      around.push(id-1, id+1, id-nsqrt-1, id-nsqrt, id-nsqrt+1);
      return around;
    }
    // typical square
    around.push(id-nsqrt-1, id-nsqrt, id-nsqrt+1, id+nsqrt-1, id+nsqrt, id+nsqrt+1, id-1, id+1);
    return around;
  }

  // check if game won
  const checkGame = () => {
    if (nsqrt === n - visitedSet.size) {
      if (!main.children[n]) {
        const text = document.createElement("div");
        text.innerText = 'winner!';
        main.appendChild(text);
      }
      return;
    }
  }

  // create squares and attach to DOM
  const makeSquares = () => {
    for (let i = 0; i < n; i++) {
      arr.push(new Square(i));
      main.appendChild(arr[i].div);
    }
  };
  makeSquares();

  // randomize and add bombs
  const pickBombs = () => {
    let random = (n) => Math.floor(Math.random() * n);
    let j = 0;
    while (j < m) {
      const mine = random(n);
      if (arr[mine].value !== "b") { // make sure correct # bombs
        arr[mine].value = "b"; // main.children[mine].innerHTML = "b";
        j++;
      }
    }
  };
  pickBombs();

  // getting number of bombs nearby
  const sumAround = () => {
    arr.forEach((el, idx) => {
      if (el.value === "b") return;
      arr[idx].value = showAround(el.id).reduce((acc, val) => {
        if (arr[val].value === "b") acc += 1;
        return acc;
      }, 0);
    })
  }
  sumAround();
})();
