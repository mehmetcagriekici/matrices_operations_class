export function fullReduce(augmented: number[][]) {
  //first loop, reduce left of the leading ones, using the rows below
  for (let i = 0; i < augmented.length; i++) {
    let pivot = 1;
    //loop over the row
    //find pivot (1 / element -> leading 1) //the value which will make the pivot position 1
    for (let j = 0; j < augmented[i].length; j++)
      if (i == j && augmented[i][j]) {
        pivot = 1 / augmented[i][j];
        break;
      }

    //loop over the entire row again to uptade it
    if (pivot !== 1 && pivot)
      for (let j = 0; j < augmented[i].length; j++)
        augmented[i][j] = Number(Number(augmented[i][j] * pivot).toFixed(3));

    //reduce the rows below
    //reduce the element under the pivot position
    for (let r = i + 1; r < augmented.length; r++) {
      let reducer = 0;
      //loop over the row below
      for (let j = 0; j < augmented[r].length; j++)
        if (j === i && augmented[r][j]) reducer = 1 / augmented[r][j];

      //multiply the all elements with the reducer and subtract the recuer row
      if (reducer)
        for (let j = 0; j < augmented[r].length; j++)
          augmented[r][j] = Number(
            Number(augmented[r][j] * reducer - augmented[i][j]).toFixed(3)
          );
    }
  }

  //second loop, reduce right of the leading ones, using the rows above
  for (let i = augmented.length - 1; i >= 0; i--) {
    //reduce the left hand side off the augmented matrix row, mutate the entire row
    //loop over the rows above
    for (let r = i - 1; r >= 0; r--) {
      //loop over the current (i) row, multiply the leading 1 with the corresponding element in the reduced (r) row. subtract reduced row from the current row
      let reducer = 0;
      //find the reducer
      for (let j = 0; j < augmented[i].length; j++)
        if (j === i) {
          reducer = augmented[i][j] * augmented[r][j];
          break;
        }

      //mutate the row above using the current row
      for (let j = 0; j < augmented[r].length; j++)
        augmented[r][j] = Number(
          Number(augmented[r][j] - augmented[i][j] * reducer).toFixed(3)
        );
    }
  }

  return augmented;
}
