import {useEffect, useRef, useState} from 'react';
import Chart from '@nce/eview-react/Chart';
import {useApp} from '../../context.jsx';

function scaleOption(maximum, actual, maximumLabel, actualLabel, colors) {
  const end = Math.max(maximum * 2, Math.ceil(actual * 1.2));
  return {
    animation: false,
    grid: {top: 0, bottom: 0, left: 0, right: 0},
    xAxis: {type: 'value', min: 0, max: end, show: false},
    yAxis: {type: 'value', min: 0, max: 1, show: false},
    series: [{
      type: 'custom', silent: true, data: [[maximum, actual]], encode: {x: [0, 1]},
      renderItem: (_, api) => {
        const [startX, y] = api.coord([0, 0.5]);
        const [endX] = api.coord([end, 0.5]);
        const [limitX] = api.coord([api.value(0), 0.5]);
        const [actualX] = api.coord([api.value(1), 0.5]);
        const line = (x1, y1, x2, y2, stroke, width) => ({
          type: 'line', shape: {x1, y1, x2, y2}, style: {stroke, lineWidth: width, lineCap: 'round'},
        });
        const label = (x, y, text, fill) => ({
          type: 'text', style: {x, y, text, fill, align: 'center', verticalAlign: 'middle', font: colors.font},
        });
        return {type: 'group', children: [
          line(startX + 3, y, endX - 3, y, colors.track, 5),
          line(startX + 3, y, limitX, y, colors.safe, 5),
          line(limitX, y - 8, limitX, y + 8, colors.label, 1),
          {type: 'circle', shape: {cx: actualX, cy: y, r: 4}, style: {fill: colors.actual}},
          label(limitX, y + 18, maximumLabel, colors.label),
          label(actualX, y - 15, actualLabel, colors.actual),
        ]};
      },
    }],
  };
}

export default function TimeoutScale({maximum, actual, maximumLabel, actualLabel}) {
  const {isDark} = useApp();
  const chartBase={a2ui:true,theme:isDark?'hdesign-dark':'hdesign-light'};
  const host = useRef(null);
  const [colors, setColors] = useState(null);
  useEffect(() => {
    const style = getComputedStyle(host.current);
    setColors({
      track: style.getPropertyValue('--outline-variant').trim(),
      safe: style.getPropertyValue('--success').trim(),
      actual: style.getPropertyValue('--error').trim(),
      label: style.getPropertyValue('--color-text-secondary').trim(),
      font: style.getPropertyValue('--font-size-sm').trim() + ' ' + style.fontFamily,
    });
  }, [isDark]);
  return <div className="rule-inspection-scale" ref={host} aria-hidden="true">
    {colors && <Chart option={{...chartBase, ...scaleOption(maximum, actual, maximumLabel, actualLabel, colors)}}/>}
  </div>;
}
