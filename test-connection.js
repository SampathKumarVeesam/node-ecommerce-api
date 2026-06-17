const dns = require('dns');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('===================================================');
console.log('         MONGODB CONNECTION DIAGNOSTIC TOOL        ');
console.log('===================================================');
console.log(`Current Time   : ${new Date().toISOString()}`);
console.log(`Node.js Version: ${process.version}`);
console.log(`MONGODB_URI    : ${process.env.MONGODB_URI ? 'LOADED (found in .env)' : 'NOT FOUND (missing from .env)'}`);
console.log('---------------------------------------------------');

if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not set in your .env file!');
  process.exit(1);
}

const connectionString = process.env.MONGODB_URI;
const isSrv = connectionString.startsWith('mongodb+srv://');
console.log(`Connection Type: ${isSrv ? 'MongoDB Atlas SRV (+srv)' : 'Standard MongoDB Connection'}`);

// Parse Host from Connection String
let host = '';
try {
  if (isSrv) {
    host = connectionString.split('@')[1].split('/')[0].split('?')[0];
  } else {
    host = connectionString.split('@')[1].split('/')[0].split(',')[0].split(':')[0];
  }
  console.log(`Parsed Host    : ${host}`);
} catch (err) {
  console.error('❌ ERROR parsing connection string host:', err.message);
}

// Step 1: DNS Resolution test
console.log('\n[STEP 1] TESTING DNS RESOLUTION...');

// Apply IPv4 priority fix
console.log('Applying IPv4 DNS resolution priority (setDefaultResultOrder)...');
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

if (host) {
  if (isSrv) {
    const srvRecord = `_mongodb._tcp.${host}`;
    console.log(`Resolving SRV records for: ${srvRecord}...`);
    dns.resolveSrv(srvRecord, (srvErr, addresses) => {
      if (srvErr) {
        console.error(`❌ DNS SRV RESOLVE FAILED: ${srvErr.code} (${srvErr.message})`);
        console.log('\n👉 Troubleshooting SRV issues:');
        console.log('   - Your current internet provider (ISP) or local router DNS might block SRV lookups.');
        console.log('   - Check if you are behind a VPN or corporate firewall blocking port 27017.');
        console.log('   - Bypassing DNS SRV: Try changing your system DNS to Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1).');
      } else {
        console.log('✅ DNS SRV RESOLVE SUCCESSFUL!');
        console.log('Discovered Shards:', JSON.stringify(addresses, null, 2));
      }
      // Proceed to test IP lookup
      testDnsLookup();
    });
  } else {
    testDnsLookup();
  }
} else {
  testMongooseConnect();
}

function testDnsLookup() {
  console.log(`\nResolving IP addresses for: ${host}...`);
  dns.lookup(host, (lookupErr, address, family) => {
    if (lookupErr) {
      console.error(`❌ DNS HOST LOOKUP FAILED: ${lookupErr.code} (${lookupErr.message})`);
    } else {
      console.log(`✅ DNS HOST LOOKUP SUCCESSFUL! Resolved IP: ${address} (IPv${family})`);
    }
    testMongooseConnect();
  });
}

// Step 2: Mongoose Connection test
function testMongooseConnect() {
  console.log('\n[STEP 2] TESTING MONGOOSE CONNECTION...');
  console.log('Connecting to database...');

  const options = {
    serverSelectionTimeoutMS: 5000 // 5 seconds timeout
  };

  mongoose
    .connect(connectionString, options)
    .then((conn) => {
      console.log('\n===================================================');
      console.log('🎉 SUCCESS: MONGODB ATLAS CONNECTED SUCCESSFULLY!');
      console.log('===================================================');
      console.log(`Connected Host : ${conn.connection.host}`);
      console.log(`Database Name  : ${conn.connection.name}`);
      console.log('===================================================');
      mongoose.disconnect();
    })
    .catch((err) => {
      console.error('\n===================================================');
      console.error('❌ FAILURE: MONGODB ATLAS CONNECTION FAILED!');
      console.error('===================================================');
      console.error(`Error Code     : ${err.code || 'N/A'}`);
      console.error(`Message        : ${err.message}`);
      console.error(`Full Stack Trace:\n${err.stack}`);
      console.log('---------------------------------------------------');
      console.log('👉 Troubleshooting Connection Failures:');
      console.log('   1. Double check that your Database Password in MONGODB_URI is correct.');
      console.log('   2. Confirm that you whitelisted 0.0.0.0/0 (or your specific IP) in MongoDB Atlas Network Access.');
      console.log('   3. If you still see ECONNREFUSED, your local firewall or ISP blocks connection to port 27017.');
      console.log('===================================================');
      process.exit(1);
    });
}
