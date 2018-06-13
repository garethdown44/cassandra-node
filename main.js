const express = require('express');
const cassandra = require('cassandra-driver');

const app = express();

let contactPoints;
if (process.env.CASSANDRA_LOCAL) {
  contactPoints = ['192.168.99.100:30708'];
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

app.listen(8080, () => console.log('Example app listening on port 8080!'))