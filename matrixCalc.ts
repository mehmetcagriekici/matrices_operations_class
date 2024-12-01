import { reducedEchelonSolver } from "./reducedEchelonSolver";
import { reduceAugmented } from "./reduceAugmented";
import { fullReduce } from "./fullReduce";

type matrixT = number[][];

//accessible (might need computer help)
export function matrix() {
  //operations
  function addMatrix(newMatrix: matrixT, matrices: matrixT[]) {
    //check if entry is valid
    if (!checkIfValid(newMatrix))
      throw new Error("Invalid data passed from the form!");

    matrices.push(newMatrix);
  }

  function removeMatrix(index: number, matrices: matrixT[]) {
    if (!matrices[index])
      throw new Error("No matrix has been found at the received index");

    matrices.splice(index, 1);
  }

  function calcTranspose(matrix: matrixT, isValidated: boolean = false) {
    if (!isValidated)
      if (!checkIfValid(matrix))
        throw new Error("Provided matrix is not a valid matrix!");

    const transposed: matrixT = [];

    for (let i = 0; i < matrix[0].length; i++) {
      transposed.push([]);
      for (let j = 0; j < matrix.length; j++) transposed[i].push(matrix[j][i]);
    }

    return transposed;
  }

  function calcMultiplication(matrixA: matrixT, matrixB: matrixT) {
    if (!checkIfValid(matrixA))
      throw new Error("MatrixA is not a valid matrix.");
    if (!checkIfValid(matrixB))
      throw new Error("MatrixB is not a valid matrix.");
    if (matrixA[0].length !== matrixB.length)
      throw new Error("Provided matrices can not be multiplied!");

    //A = pxq, B = mxn, AB = pxn
    const result: matrixT = [];

    for (let i = 0; i < matrixA.length; i++) {
      result.push([]);
      for (let j = 0; j < matrixB[i].length; j++) {
        let sum = 0;
        for (let k = 0; k < matrixA[i].length; k++)
          sum += matrixA[i][k] * matrixB[i][j];

        result[i].push(sum);
        sum = 0;
      }
    }

    return result;
  }

  function calcDet(matrix: matrixT) {
    //must be a square matrix
    if (!isSquareMatrix(matrix))
      throw new Error("Only square matrices' determianants can be calculated.");

    //base (determinant of a second order matrix)
    if (matrix.length === 2)
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

    const [expanded, ...rest] = matrix;

    const next: matrixT = [];

    let sum = 0;
    for (let i = 0; i < expanded.length; i++) {
      for (let j = 0; j < rest.length; j++) {
        next.push([]);
        for (let k = 0; k < rest[j].length; k++)
          if (i !== k) next[j].push(rest[j][k]);
      }
      const sign = i % 2 === 0 ? 1 : -1;
      sum += expanded[i] * sign * calcDet(next);
      next.length = 0;
    }
    return sum;
  }

  function calcAddSub(matrixA: matrixT, matrixB: matrixT, operation: string) {
    if (!checkIfValid(matrixA))
      throw new Error("MatrixA is not a valid matrix.");
    if (!checkIfValid(matrixB))
      throw new Error("MatrixB is not a valid matrix.");
    //same shape (if they are valid)
    if (
      matrixA.length !== matrixB.length ||
      matrixA[0].length !== matrixB[0].length
    )
      throw new Error("Provided matrices are not in the same shapesç");

    const result: matrixT = [];
    if (operation === "addition")
      for (let i = 0; i < matrixA.length; i++) {
        result.push([]);
        for (let j = 0; j < matrixA[i].length; j++)
          result[i].push(matrixA[i][j] + matrixB[i][j]);
      }

    if (operation === "subtraction")
      for (let i = 0; i < matrixA.length; i++) {
        result.push([]);
        for (let j = 0; j < matrixA[i].length; j++)
          result[i].push(matrixA[i][j] - matrixB[i][j]);
      }

    return result;
  }

  function calcScalarMultiplication(scalar: number, matrix: matrixT) {
    if (!checkIfValid(matrix))
      throw new Error("Provided matrix is not a valid matrix.");

    const result: matrixT = [];

    for (let i = 0; i < matrix.length; i++) {
      result.push([]);
      for (let j = 0; j < matrix[i].length; j++)
        result[i].push(scalar * matrix[i][j]);
    }

    return result;
  }

  //muliptly by inverse
  function calcMatrixDivision(divided: matrixT, divisior: matrixT) {
    //divided * divisior ** -1 (inverse of the divisior)
    return calcMultiplication(divided, calcInverse(divisior));
  }

  function calcInverse(matrix: matrixT): matrixT {
    //a square matrix' multiplication with its inverse gives an identity matrix
    //if a matrix's determiant iz zero it doesn't have an inverse
    const det = calcDet(matrix);
    if (!det)
      throw new Error(
        "For a matrix to have an inverse, its determinant must not be zero."
      );

    //create an identity matrix with the same shape as the input matrix.
    const inverse = matrix.map((row, rowIndex) =>
      row.map((_, colIndex) => (colIndex === rowIndex ? 1 : 0))
    );

    //concatinate each row of the created identity matrix with the input matrix in an augmented matrix
    const augmented = matrix.map((row, rowIndex) => [
      ...row,
      ...inverse[rowIndex],
    ]);

    //convert input matrix to created identity matrix while mutating the identity matrix in the augmented matrix, using elementary row level operations (fully reduce the augmented matrix, all elements except leading 1s are zeros)
    const reduced = fullReduce(augmented);

    //return the mutaded identity matrix (inverse) (right hand side of the reduced augmented matrix)
    return reduced.map((row) => row.filter((_, i) => i >= row.length / 2));
  }

  //public controllers
  function isSymmetricMatrix(matrix: matrixT) {
    //symmetric matrices must be square matrices
    if (!isSquareMatrix(matrix)) return false;

    //its transpose and itself must be identical
    const transposed = calcTranspose(matrix, true);

    for (let i = 0; i < matrix.length; i++)
      for (let j = 0; j < matrix[i].length; j++)
        if (matrix[i][j] !== transposed[i][j]) return false;

    return true;
  }

  function isOrthogonalMatrix(matrix: matrixT) {
    //orthogonal matrices must be square matrices
    if (!isSquareMatrix(matrix)) return false;

    const transposed = calcTranspose(matrix, true);

    //an orthogonal matrix' multiplication with its transpose and an othogonal matrix' transpose's multiplication with itself must be identicals and unit matrices

    const tm = calcMultiplication(transposed, matrix);
    const mt = calcMultiplication(matrix, transposed);

    //identical
    for (let i = 0; i < tm.length; i++)
      for (let j = 0; j < tm[i].length; j++)
        if (mt[i][j] !== tm[i][j]) return false;

    //unit (if they are identical)
    if (!isUnitMatrix(mt)) return false;

    return true;
  }

  function isRotation(matrix: matrixT) {
    const det = calcDet(matrix);
    return det === 1;
  }

  function isReflection(matrix: matrixT) {
    const det = calcDet(matrix);
    return det === -1;
  }

  function solveEquations(augmented: matrixT): { [key: string]: string } {
    if (!checkIfValid(augmented))
      throw new Error("Equation must be in a valid augmented matrix form.");

    const reduced = reduceAugmented(augmented).map((row) =>
      row.map((col) => Number(col.toFixed(2)))
    );

    return reducedEchelonSolver(reduced);
  }

  return {
    addMatrix,
    removeMatrix,
    calcTranspose,
    calcMultiplication,
    calcScalarMultiplication,
    calcMatrixDivision,
    calcDet,
    calcAddSub,
    calcInverse,
    isSymmetricMatrix,
    isOrthogonalMatrix,
    isRotation,
    isReflection,
    solveEquations,
  };
}

//private controllers (human eye is better)
function noMatrix(matrix: matrixT) {
  if (!matrix.length) return true;
  for (let i = 0; i < matrix.length; i++) if (!matrix[i].length) return true;
  return false;
}

function checkIfValid(matrix: matrixT) {
  if (noMatrix(matrix)) return false;

  //for a matrix to be valid, all rows must have the same length and all elements should be number
  const firstRowLength = matrix[0].length;

  for (const row of matrix) {
    if (row.length !== firstRowLength) return false;
    for (const el of row) if (Number.isNaN(Number(el))) return false;
  }

  return true;
}

function isSquareMatrix(matrix: matrixT) {
  if (!checkIfValid(matrix)) throw new Error("Provided matrix is invalid!");

  if (matrix.length === matrix[0].length) return true;

  return false;
}

function isUnitMatrix(matrix: matrixT) {
  //unit matrices should be square matrices
  if (!isSquareMatrix(matrix)) return false;

  //diagon side
  let primary = true; //left to right

  //if elements on a diagonal of a matrix are ones and rest of the elements are zeroes, the matrix is a unit matrix
  for (let i = 0; i < matrix.length; i++)
    for (let j = 0; j < matrix[i].length; j++) {
      if (i === 0)
        if (j === 0 && matrix[i][j] === 1) primary = true;
        else primary = false;
      //if current element is any number but zero or one
      if (matrix[i][j] !== 1 || matrix[i][j] !== 0) return false;

      //left to right diagonal
      if (primary && i === j && matrix[i][j] !== 1) return false;
      if (primary && i !== j && matrix[i][j] !== 0) return false;

      //right to left diagonal
      if (!primary && i + j === matrix[j].length - 1 && matrix[i][j] !== 1)
        return false;
      if (!primary && i + j !== matrix[j].length && matrix[i][j] !== 0)
        return false;
    }

  return true;
}
