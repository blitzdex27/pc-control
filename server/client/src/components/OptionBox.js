import { useRef, useState } from 'react';
import './OptionBox.css';

function AddUnit({ unit, submitActionHandler, cancelActionHandler }) {
  const newSlot = useRef();
  const { slot, ip } = unit;

  const formHandler = (e) => {
    const url = `/update-unit/?action=modify&slot=${slot}&newslot=${newSlot.current.value}&ip=${ip}`;
    submitActionHandler(e, url);
  };

  return (
    <form onSubmit={formHandler} className="mod-unit">
      <h2>Add/Modify PC Unit Slot [CURRENT: SLOT {slot}]</h2>
      <label>New slot:</label>
      <input ref={newSlot} type="text"></input>
      <button>Add</button>
    </form>
  );
}

function RemoveUnit({ slot, submitActionHandler, cancelActionHandler }) {
  const formHandler = (e) => {
    const url = `/update-unit/?action=remove&slot=${slot}`;
    submitActionHandler(e, url);
  };
  return (
    <form onSubmit={formHandler} className="mod-unit">
      <h2>Remove PC Unit [SLOT {slot}]</h2>
      <p>Are you sure you want to remove this PC Unit?</p>
      <button type="submit">Yes</button>
      <button onClick={cancelActionHandler} type="button">
        No
      </button>
    </form>
  );
}

function ShutdownUnit({ slot, submitActionHandler, cancelActionHandler }) {
  const formHandler = (e) => {
    const url = `/update-unit/?action=shutdown&slot=${slot}`;
    submitActionHandler(e, url);
  };
  return (
    <form onSubmit={formHandler} className="mod-unit">
      <h2>Shutdown PC Unit</h2>
      <p>Are you sure you want to SHUTDOWN this PC Unit?</p>
      <button type="submit">Yes</button>
      <button onClick={cancelActionHandler} type="button">
        No
      </button>
    </form>
  );
}

function RunCMD({ ip, submitActionHandler, cancelActionHandler }) {
  const [cmdOut, setCmdOut] = useState(null);
  const cmd = useRef();
  
  const formHandler = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `/run-command/?ip=${encodeURIComponent(ip)}&cmd=${encodeURIComponent(cmd.current.value)}`
    );
    console.log(`/run-command/?ip=${encodeURIComponent(ip)}&cmd=${encodeURIComponent(cmd.current.value)}`)
    const json = await response.json();
    const out = {
      stdout: json.stdout,
      stderr: json.stderr,
    };
    setCmdOut(out);
  };
  return (
    <div className="run-cmd">
      <h2>Pseudo Command Line Interface</h2>
      <form onSubmit={formHandler}>
        <label>Command:</label>
        <input ref={cmd} type="text" placeholder="Enter command here..." />
      </form>
      <div className="cmd-out">
        <h2>OUTPUT</h2>
        <pre>{cmdOut && cmdOut.stdout}</pre>
        <h2>ERRORS</h2>
        <pre>{cmdOut && cmdOut.stderr}</pre>
      </div>
    </div>
  );
}

function OptionMenu({ slot, handlers }) {
  const { addPc, removePc, shutdownPc, runCMD } = handlers;
  return (
    <div className="option-menu">
      <h2>What do you want to do with [SLOT {slot}]?</h2>
      <button onClick={addPc}>Add/Modify PC</button>
      <button onClick={removePc}>Remove PC</button>
      <button onClick={shutdownPc}>Shutdown</button>
      <button onClick={runCMD}>Run command</button>
    </div>
  );
}

function OptionBox({ unit, submitActionHandler, cancelActionHandler }) {
  const [selectedOpt, setSelectedOpt] = useState(null);
  const { slot } = unit;

  const handlers = {
    addPc: () => {
      setSelectedOpt('add');
    },
    removePc: () => {
      setSelectedOpt('remove');
    },
    shutdownPc: () => {
      setSelectedOpt('shutdown');
    },
    runCMD: () => {
      setSelectedOpt('runcmd');
    },
  };

  return (
    <>
      <div className="option-box">
        {!selectedOpt && <OptionMenu slot={slot} handlers={handlers} />}
        {selectedOpt === 'add' && (
          <AddUnit
            unit={unit}
            submitActionHandler={submitActionHandler}
            cancelActionHandler={cancelActionHandler}
          />
        )}
        {selectedOpt === 'remove' && (
          <RemoveUnit
            slot={slot}
            submitActionHandler={submitActionHandler}
            cancelActionHandler={cancelActionHandler}
          />
        )}
        {selectedOpt === 'shutdown' && (
          <ShutdownUnit
            slot={slot}
            submitActionHandler={submitActionHandler}
            cancelActionHandler={cancelActionHandler}
          />
        )}
        {selectedOpt === 'runcmd' && (
          <RunCMD
            ip={unit.ip}
            submitActionHandler={submitActionHandler}
            cancelActionHandler={cancelActionHandler}
          />
        )}
      </div>
      <div onClick={cancelActionHandler} className="backdrop"></div>
    </>
  );
}

export default OptionBox;
