import './UnSlottedUnitsBlock.css';

import PcBlock from '../PcBlock';

function UnSlottedUnitsBlock({ unSlottedUnits, optionHandler, scanHandler }) {
  return (
    <div className="unslotted-units-block-cont">
      <h2>Unslotted</h2>
      <button onClick={scanHandler}>Scan</button>
      <div className="unslotted-units-block">
        {unSlottedUnits.map((unit) => {
          return <PcBlock unit={unit} optionHandler={optionHandler} />;
        })}
      </div>
    </div>
  );
}

export default UnSlottedUnitsBlock;
