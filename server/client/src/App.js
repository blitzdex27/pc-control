import { useEffect, useState } from 'react';
import './App.css';
import PcBlock from './components/PcBlock';
import { pcUnitsInitState, optionInitState } from './initStates';
import OptionBox from './components/OptionBox';

function App() {
  const [computerUnits, setComputerUnits] = useState([...pcUnitsInitState()]);
  const [option, setOption] = useState(optionInitState);

  /**
   * Sort descending
   */
  computerUnits.sort((a, b) => {
    const aSlot = a.slot;
    const bSlot = b.slot;

    if (aSlot > bSlot) {
      return 1;
    } else if (aSlot < bSlot) {
      return -1;
    } else {
      return 0;
    }
  });

  /**
   * update state of units
   */
  const updateUnitsState = () => {
    const update = async () => {
      const result = await fetch('/units-states');
      const json = await result.json();

      return json;
    };
    update().then((unitsStates) => {
      if (unitsStates) {
        const cU = [...pcUnitsInitState()];
        const newCU = [];

        for (let i = 0; i < pcUnitsInitState().length; i += 1) {
          for (let j = 0; j < unitsStates.length; j += 1) {
            if (i + 1 === unitsStates[j].slot) {
              newCU.push(unitsStates[j]);
            }
          }
          const occupiedSlots = newCU.map((unit) => unit.slot);
          console.log(occupiedSlots);
          console.log(occupiedSlots.includes(cU.find((unit) => unit.slot)));

          if (!occupiedSlots.includes(cU[i].slot)) {
            const index = cU.findIndex((unit) => unit.slot === i + 1);
            newCU.push(cU[index]);
          }
        }
        console.log(newCU);
        setComputerUnits(newCU);
      }
    });
  };

  /**
   * Fetch updated state of units on first launch or reload
   */
  useEffect(() => {
    updateUnitsState();
    // eslint-disable-next-line
  }, []);

  const optionHandler = (e, slot) => {
    setOption({
      show: true,
      slot: slot,
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

  return (
    <>
      <div className="App">
        {computerUnits.map((unit) => {
          return <PcBlock unit={unit} optionHandler={optionHandler} />;
        })}
      </div>
      {option.show && (
        <OptionBox
          slot={option.slot}
          submitActionHandler={submitActionHandler}
          cancelActionHandler={cancelActionHandler}
        />
      )}
    </>
  );
}

export default App;
