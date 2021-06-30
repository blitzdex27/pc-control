import { useEffect, useState } from 'react';
import './App.css';

import UnitsBlock from './components/macro-components/UnitsBlock';
import UnSlottedUnitsBlock from './components/macro-components/UnSlottedUnitsBlock';
import OptionBox from './components/OptionBox';

import { pcUnitsInitState, optionInitState } from './initStates';
import sort from './lib/sort';

function App() {
  const [computerUnits, setComputerUnits] = useState([...pcUnitsInitState()]);
  const [unSlottedUnits, setUnSlottedUnits] = useState([]);
  const [option, setOption] = useState(optionInitState);

  /**
   * Sort descending
   */
  sort(computerUnits, { propBase: 'slot', ascending: false });

  /**
   * update state of units
   */
  const updateUnitsState = () => {
    const update = async () => {
      const result = await fetch('/units-states');
      const json = await result.json();
      console.log(json);
      return json;
    };
    update().then(({ updUnits, unSlottedUnits: unSlotted }) => {
      console.log('updating...');

      if (updUnits) {
        const updSlots = updUnits.map((unit) => unit.slot);
        const units = pcUnitsInitState().filter(
          (unit) => !updSlots.includes(unit.slot)
        );

        units.push(...updUnits);
        console.log(units);
        setComputerUnits(units);
        setUnSlottedUnits(unSlotted);
      }

      // setUnSlottedUnits(unSlottedUnits);

      // for (let i = 0; i < pcUnitsInitState().length; i += 1) {
      //   for (let j = 0; j < updUnits.length; j += 1) {
      //     if (i + 1 === updUnits[j].slot) {
      //       newCU.push(updUnits[j]);
      //     }
      //   }
      //   const occupiedSlots = newCU.map((unit) => unit.slot);

      //   if (!occupiedSlots.includes(cU[i].slot)) {
      //     const index = cU.findIndex((unit) => unit.slot === i + 1);
      //     newCU.push(cU[index]);
      //   }
      // }
      // }
    });
  };

  /**
   * Fetch updated state of units on first launch or reload
   */
  useEffect(() => {
    updateUnitsState();
    // eslint-disable-next-line
  }, []);

  const optionHandler = (unit) => {
    setOption({
      show: true,
      unit: unit,
    });
  };

  const submitActionHandler = (e, url) => {
    e.preventDefault();

    const updateUnit = async () => {
      const result = await fetch(url, {
        method: 'PUT',
      });
      const json = await result.json();
      return json;
    };
    updateUnit().then(() => {
      setOption(optionInitState);
      updateUnitsState();
    });
  };

  const cancelActionHandler = (e) => {
    e.preventDefault();
    setOption(optionInitState);
  };

  const scanHandler = async () => {
    const response = await fetch('/other-units');
    const json = await response.json();
    setUnSlottedUnits(json);
  };

  return (
    <>
      <div className="App">
        <UnitsBlock
          computerUnits={computerUnits}
          optionHandler={optionHandler}
        />
        <UnSlottedUnitsBlock
          unSlottedUnits={unSlottedUnits}
          optionHandler={optionHandler}
          scanHandler={scanHandler}
        />
        {option.show && (
          <OptionBox
            unit={option.unit}
            submitActionHandler={submitActionHandler}
            cancelActionHandler={cancelActionHandler}
          />
        )}
      </div>
    </>
  );
}

export default App;
