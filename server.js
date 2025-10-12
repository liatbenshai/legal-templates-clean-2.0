// שרת Node.js פשוט להרצת המערכת
const { spawn } = require('child_process');
const path = require('path');

console.log('\n🚀 מתחיל את שרת המערכת המשפטית...\n');

// הרץ את Next.js
const nextServer = spawn('node', ['node_modules/next/dist/bin/next', 'start', '-p', process.env.PORT || '3000'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

nextServer.on('error', (error) => {
  console.error('❌ שגיאה בהפעלת השרת:', error);
  process.exit(1);
});

nextServer.on('close', (code) => {
  if (code !== 0) {
    console.log(`\n⚠️  השרת נסגר עם קוד: ${code}\n`);
  }
});

// טיפול בסגירה
process.on('SIGINT', () => {
  console.log('\n\n👋 סוגר את השרת...\n');
  nextServer.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  nextServer.kill();
  process.exit(0);
});

console.log('✅ השרת רץ!');
console.log(`🌐 גלוש ל: http://localhost:${process.env.PORT || 3000}\n`);

