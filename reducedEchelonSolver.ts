export function reducedEchelonSolver(reduced: number[][]) {
  const solution: { [key: string]: string } = {}; // {[key: string]: string}
  //for reduced[i][j], all elements before j where j === i, must be zeroes
  //for i === j reduced[i][j] can be one or zero

  //start looping from the end of the main augmented matrix
  for (let i = reduced.length - 1; i >= 0; i--) {
    //last element of the row is right hand operator of the equation
    const rightHand = reduced[i][reduced[i].length - 1];
    //calculate the left hand side of the operation
    let leftHand = ""; //"[0-9]\s-\s[0-9]x[0-9]"
    let lhVal = "0";
    let lhCo = "0";
    let lhInx = "";
    //loop over the row starting from the latest coefficent before the right hand until the leading 1 position
    for (let j = reduced[i].length - 2; j >= i; j--) {
      //destructure current lefthand
      if (leftHand) {
        const [val, dep] = leftHand.split(" - ");
        if (val) lhVal = val;
        if (dep) {
          const [co, inx] = dep.split("x");
          if (co) lhCo = co;
          if (inx) lhInx = inx;
        }
      }

      //if current coef is already calculated
      if (solution[`x${j}`]) {
        //destructure the solution
        const [val, dep] = solution[`x${j}`].split(" - ");

        if (!dep)
          leftHand = `${
            reduced[i][j] * Number(val) + Number(lhVal)
          } - ${lhCo}x${lhInx}`;

        if (dep) {
          const [co, inx] = dep.split("x");

          leftHand = `${reduced[i][j] * Number(val) + Number(lhVal)} - ${
            reduced[i][j] * Number(co) + Number(lhCo)
          }x${inx}`;
        }
      }

      //if loop iterates over the curr coef for the first time
      if (!solution[`x${j}`] && reduced[i][j]) {
        //if there are other coefficents before the current coefficent
        //update left hand
        if (reduced[i][j - 1]) leftHand = `${lhVal} - ${reduced[i][j]}x${j}`;

        //calculate the solution using the left hand and the right hand
        if (!reduced[i][j - 1])
          solution[`x${j}`] = `${(rightHand - Number(lhVal)) / reduced[i][j]}${
            Number(lhCo) ? ` - ${-Number(lhCo) / reduced[i][j]}x${lhInx}` : ""
          }`;
      }
    }

    //reset left hand
    leftHand = "";
  }

  const fixStr = (str: string) =>
    String(Number(str).toFixed(2)).replace(/0*$/, "").replace(/\.$/, "");

  //loop over the solution to organize results
  for (const [key, value] of Object.entries(solution)) {
    //destructure value
    const [val, dep] = value.split(" - ");
    const fixedVal = fixStr(val);

    if (dep) {
      const [co, inx] = dep.split("x");
      const fixedCo = fixStr(co);

      //add free coef to the solution object
      solution[`x${inx}`] = "free";

      //remove the slash from the current element, add the operation sign
      solution[key] =
        Number(co) < 0
          ? `${Number(val) === 0 ? "-" : `${fixedVal} - `}${Math.abs(
              Number(fixedCo)
            )}x${inx}`
          : `${Number(val) === 0 ? "" : `${fixedVal} + `}${fixedCo}x${inx}`;
    }

    if (!dep) solution[key] = fixedVal;
  }

  return solution;
}
