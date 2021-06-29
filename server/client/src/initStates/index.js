export const pcUnitsInitState = () => {
  const slots = 30;
  const units = [];

  for (let i = 1; i <= slots; i += 1) {
    const initStatus = {
      mounted: false,
      online: false,
      action: null,
    };
    const properties = {
      slot: i,
      pcName: `PC-${i}`,
      status: initStatus,
      ip: null,
    };

    units.push(properties);
  }
  return units;
};

export const optionInitState = {
    show: false,
    slot: null,
  }