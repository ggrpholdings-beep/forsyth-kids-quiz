const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'lib', 'activities.ts');

function run(){
  if(!fs.existsSync(FILE)){
    console.error('activities file not found:', FILE);
    process.exit(1);
  }

  const src = fs.readFileSync(FILE,'utf8');
  const marker = 'export const activities';
  const idx = src.indexOf(marker);
  if(idx === -1){ console.error('cannot find activities export'); process.exit(1); }
  const equalsIndex = src.indexOf('=', idx);
  const arrStart = src.indexOf('[', equalsIndex);
  const arrEnd = src.lastIndexOf('];');
  const jsonText = src.slice(arrStart, arrEnd+1);

  let arr;
  try{ arr = JSON.parse(jsonText); }catch(e){ console.error('JSON parse error', e); process.exit(1); }

  const targetName = 'Monroe County Fine Arts Center';
  const targetAddress = '27 Brooklyn Ave, Forsyth, GA 31029';

  const before = arr.length;
  const filtered = arr.filter(a => !(a.name === targetName && a.address === targetAddress));
  const removed = before - filtered.length;

  if(removed === 0){
    console.log('No matching Monroe County entry found to remove.');
    return;
  }

  const header = src.slice(0, idx);
  const prefix = 'export const activities: Activity[] = ';
  const newContent = header + prefix + JSON.stringify(filtered, null, 2) + ';\n';
  fs.writeFileSync(FILE, newContent, 'utf8');
  console.log(`Removed ${removed} entry(ies). Wrote ${filtered.length} remaining.`);
}

run();
