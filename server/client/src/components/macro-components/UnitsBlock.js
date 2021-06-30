import './UnitBlock.css';

import PcBlock from '../PcBlock';

function UnitsBlock({ computerUnits, optionHandler }) {
  return (
    <div className="units-block-cont">
      <h2>PC Units</h2>
      <div className="units-block">
        {computerUnits.map((unit) => {
          return <PcBlock unit={unit} optionHandler={optionHandler} />;
        })}
      </div>
    </div>
  );
}
export default UnitsBlock;
