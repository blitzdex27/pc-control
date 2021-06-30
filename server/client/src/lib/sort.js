const sort = (unitArray, { propBase, ascending = true }) => {
  unitArray.sort((a, b) => {
    const aBase = a[propBase];
    const bBase = b[propBase];

    if (ascending) {
      return bBase - aBase;
    } else {
      return aBase - bBase;
    }
  });
};

export default sort;
