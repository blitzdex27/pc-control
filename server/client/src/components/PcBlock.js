import './PcBlock.css';

function PcBlock({ unit, optionHandler }) {
  let backgroundColor = 'black';
  let color = 'white';

  if (unit.status.action) {
    backgroundColor = '#495FDE';
    color = 'black';
  } else if (unit.status.online === true) {
    backgroundColor = '#1DDE47';
    color = 'black';
  } else if (unit.status.online === false && unit.status.mounted === true) {
    backgroundColor = '#DE1D33';
    color = 'black';
  }
  let style = {
    backgroundColor,
    color,
  };
  return (
    <div onClick={(e) => optionHandler(e, unit.slot)} style={style} className="pc-block">
      {unit.pcName}
      <ul>
        <li>
          <span>Online:</span> {unit.status.online ? 'true' : 'false'}
        </li>
        <li>
          <span>Action:</span>{' '}
          {unit.status.action ? unit.status.action : 'null'}
        </li>
        <li>
          <span>Mounted:</span> {unit.status.mounted ? 'true' : 'false'}
        </li>
        <li>
          <span>IP:</span> {unit.ip ? unit.ip : 'null'}
        </li>
      </ul>
    </div>
  );
}

export default PcBlock;
