const express = require('express');
const cassandra = require('cassandra-driver');
const transactionData = require('./transaction.json');
const template = require('./template');

Array.prototype.flatMap = function(lambda) { 
  return Array.prototype.concat.apply([], this.map(lambda)); 
};

const app = express();

let contactPoints;
if (process.env.CASSANDRA_LOCAL) {
  contactPoints = ['192.168.99.102:30189'];
} else {
  contactPoints = ['cassandra.default.svc.cluster.local'];
}

const client = new cassandra.Client({ contactPoints, keyspace: 'dev' });

app.get('/create', async (req, res) => {
  const query = 'INSERT INTO emp (empid, emp_first, emp_last, emp_dept) VALUES (uuid(), ?, ?, ?)';
  const params = ['Mick', 'Jagger', 'Sales'];
  try {
    const result = await client.execute(query, params, { prepare: true });
    res.send('Done').end();
  } catch (err) {
    res.send('Error' + err).end();
  }
});

app.get('/read', (req, res) => {
  const query = 'select * from emp;';
  client.execute(query, [])
    .then(result => {
      res.send('First result, first name: ' + result.rows[0].emp_first);
      res.end();
    })
    .catch(e => console.log(e));
});

app.get('/create-tx', async (req, res) => {
  const query = 'INSERT INTO trn (id, data) VALUES (uuid(), ?)';
  const params = [JSON.stringify(transactionData)];
  try {
    const result = await client.execute(query, params, { prepare: true });
    res.send('Done').end();
  } catch (err) {
    res.send('Error' + err).end();
  }
});

app.get('/read-tx', async (req, res) => { 
  const query = 'select * from trn;';
  client.execute(query, [])
    .then(result => {
      const transactions = result.rows.flatMap(x => JSON.parse(x.data));
      const processed = template(transactions);

      res.send(processed);
      res.end();
    })
    .catch(e => console.log(e));
});

app.listen(80, () => console.log(`Example app listening on port 80!`));