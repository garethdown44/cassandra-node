const express = require('express');
const cassandra = require('cassandra-driver');

const app = express();

let contactPoints;
if (process.env.CASSANDRA_LOCAL) {
  contactPoints = ['192.168.99.100:30708'];
} else {
  contactPoints = ['cassandra.default.svc.cluster.local'];
}

const client = new cassandra.Client({ contactPoints });

const run = async () => {
  try {
    await client.execute(`drop keyspace if exists dev`);
    await client.execute(`create keyspace dev with replication = {'class':'SimpleStrategy','replication_factor':1};`);
    await client.execute(`use dev;`);
    await client.execute(`create table emp (empid UUID primary key, emp_first varchar, emp_last varchar, emp_dept varchar);`);

    console.log('database provisioned');
  } catch (err) {
    console.log('Error occurred when creating DB ' + err);
  }
};

run();