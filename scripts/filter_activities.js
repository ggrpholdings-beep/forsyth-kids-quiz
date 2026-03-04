const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'lib', 'activities.ts');

const allowedZips = new Set(['30028','30040','30041','30097','30005','30004','30506','30518','30519']);
const allowedCities = ['cumming','forsyth','dawsonville','suwanee','sugar hill','buford','alpharetta','johns creek'];

function addressMatches(addr){
  if(!addr) return false;
  const s = addr.toLowerCase();
  for(const z of allowedZips){ if(s.includes(z)) return true; }
  for(const c of allowedCities){ if(s.includes(c)) return true; }
  return false;
}

function isGenericDescription(desc){
  if(!desc) return false;
  return /is a local .* offering programs for kids\.?$/i.test(desc.trim());
}

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

  const before = arr.length;
  const filtered = arr.filter(a => addressMatches(a.address));
  // replace generic descriptions with empty string
  for(const a of filtered){ if(isGenericDescription(a.description)) a.description = ''; }

  const after = filtered.length;

  const header = src.slice(0, idx);
  const prefix = 'export const activities: Activity[] = ';
  const newContent = header + prefix + JSON.stringify(filtered, null, 2) + ';\n';

  fs.writeFileSync(FILE, newContent, 'utf8');
  console.log(`Filtered activities: before=${before} after=${after}`);
}

run();
