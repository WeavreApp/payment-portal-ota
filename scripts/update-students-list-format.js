const fs = require('fs');
const path = require('path');

const studentsListPath = path.join(__dirname, 'students-list.txt');
const fileContent = fs.readFileSync(studentsListPath, 'utf8');
const lines = fileContent.trim().split('\n');

// Class name mapping to match CLASS_LIST format
const classMapping = {
  'J.S.1A': 'JSS1A',
  'J.S.1B': 'JSS1B',
  'J.S.1C': 'JSS1C',
  'J.S.1D': 'JSS1D',
  'J.S.2A': 'JSS2A',
  'J.S.2B': 'JSS2B',
  'J.S.2C': 'JSS2C',
  'J.S.2D': 'JSS2D',
  'J.S.3A': 'JSS3A',
  'J.S.3B': 'JSS3B',
  'J.S.3C': 'JSS3C',
  'J.S.3D': 'JSS3D',
  'S.S.1A1': 'SS1A1',
  'S.S.1A2': 'SS1A2',
  'S.S.1A3': 'SS1A3',
  'S.S.1A4': 'SS1A4',
  'S.S.1BC': 'SS1B/C',
  'S.S.2A1': 'SS2A1',
  'S.S.2A2': 'SS2A2',
  'S.S.2A3': 'SS2A3',
  'S.S.2A4': 'SS2A4',
  'S.S.2BC': 'SS2B/C',
  'S.S.3A': 'SS3A1',
  'S.S.3A2': 'SS3A2',
  'S.S.3BC': 'SS3B/C',
  'PRY 1A': 'Pry 1A',
  'PRY 1B': 'Pry 1B',
  'PRY 2A': 'Pry 2A',
  'PRY 2B': 'Pry 2B',
  'PRY 3A': 'Pry 3A',
  'PRY 3B': 'Pry 3B',
  'PRY 4A': 'Pry 4A',
  'PRY 4B': 'Pry 4B',
  'PRY 5A': 'Pry 5A',
  'PRY 5B': 'Pry 5B',
  'Pre-School': 'Pre-Schooler',
  'Toddler': 'Toddler',
  'Nursery': 'Nursery',
};

const updatedLines = lines.map(line => {
  const parts = line.split(',');
  if (parts.length >= 2) {
    const className = parts[1].trim();
    const newClassName = classMapping[className] || className;
    parts[1] = newClassName;
    return parts.join(',');
  }
  return line;
});

fs.writeFileSync(studentsListPath, updatedLines.join('\n'));
console.log(`✅ Updated ${updatedLines.length} students in students-list.txt`);
console.log('Class names now match CLASS_LIST format');
