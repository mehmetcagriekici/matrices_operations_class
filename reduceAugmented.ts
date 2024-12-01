//reduce half way, only the elements before the leading 1 position are zeros.
export function reduceAugmented(augmented: number[][]) {
  //loop over the matrix
  for (const rowIndex in augmented) {
    let leading1 = 1;
    //loop over the current row to determine the leading 1
    for (const colIndex in augmented[rowIndex])
      if (
        colIndex === rowIndex &&
        +colIndex !== augmented[rowIndex].length - 1 &&
        augmented[rowIndex][colIndex]
      )
        leading1 = 1 / augmented[rowIndex][colIndex];

    //loop over the row again, and update all of its elements
    if (leading1 !== 1)
      for (const colIndex in augmented[rowIndex])
        if (leading1)
          augmented[rowIndex][colIndex] = Number(
            Number(augmented[rowIndex][colIndex] * leading1).toFixed(3)
          );

    //reduce the rows below
    for (const reducedRowIndex in augmented)
      if (+reducedRowIndex > +rowIndex) {
        let reducer = 0;
        //reduce the elements under the leading1
        for (const reducedColIndex in augmented[reducedRowIndex])
          if (
            reducedColIndex === rowIndex &&
            augmented[reducedRowIndex][reducedColIndex]
          )
            reducer = 1 / augmented[reducedRowIndex][reducedColIndex];

        //multiply all the elemnts with reducer and subtract the reducer row
        for (const reducedColIndex in augmented[reducedRowIndex])
          if (reducer)
            augmented[reducedRowIndex][reducedColIndex] = Number(
              Number(
                augmented[reducedRowIndex][reducedColIndex] * reducer -
                  augmented[rowIndex][reducedColIndex]
              ).toFixed(3)
            );
      }
  }

  return augmented;
}
