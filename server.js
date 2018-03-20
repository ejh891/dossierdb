const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const httpServer = require('http').Server(app);
const boom = require('boom');
const moment = require('moment');
const mongoose = require('mongoose');
const cors = require('cors');

const addCacheHeaders = require('./middleware/addCacheHeaders');
const handleAsyncErrors = require('./middleware/handleAsyncErrors');

const PersonModel = require('./database/models/persons');
const RecordModel = require('./database/models/records');

const env = require('./environment/env');
const port = env.PORT;

// set up middleware to parse Http body into req.body variable
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));

// add CORS headers to response so that API can be accessed from any origin
app.use(cors());

// connect to the database
const Database = require('./database/database');
Database.connect();

/**********************************************************************************************************************
* Persons Routes
/********************************************************************************************************************/

app.post('/api/v1/persons',
  handleAsyncErrors(async (req, res) => {
    const person = req.body.data.person;

    const createdPerson = await new PersonModel(person).save();

    res.status(201); // created
    res.json({
      created: true,
      data: {
        person: createdPerson
      }
    });
  })
);

app.get('/api/v1/persons',
  // addCacheHeaders(moment.duration({ days: 1 }).asSeconds()),
  handleAsyncErrors(async (req, res) => {
    const persons = await PersonModel.find({}).lean();
    
    for (const person of persons) {
      person.records = await RecordModel.find({ personId: person._id }).lean();
    }

    res.json({
      data: {
        persons
      }
    });
  })
);

app.get('/api/v1/persons/:id',
  // addCacheHeaders(moment.duration({ days: 1 }).asSeconds()),
  handleAsyncErrors(async (req, res) => {
    const id = req.params.id;

    const person = await PersonModel.findOne({ _id: id }).lean();
    person.records = await RecordModel.find({ personId: person._id }).lean();

    res.json({
      data: {
        person
      }
    })
  })
);

app.put('/api/v1/persons/:id',
  handleAsyncErrors(async (req, res) => {
    const id = req.params.id;
    const person = req.body.data.person;

    try {
      const updatedPerson = await PersonModel.findOneAndUpdate(
        { _id: id },
        person,
        { new: true } // return the updated doc instead of the original doc
      );

      if (updatedPerson === null) {
        throw boom.notFound(`Person with id: ${id} was not found`);
      }

      res.json({
        updated: true,
        data: {
          person: updatedPerson
        }
      });
      return;
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        throw boom.badRequest('Id is malformed');
      }

      throw error;
    }

  })
);

app.delete('/api/v1/persons/:id',
  handleAsyncErrors(async (req, res) => {
    const id = req.params.id;

    try {
      const deletedPerson = await PersonModel.findOneAndRemove({ _id: id });

      if (deletedPerson === null) {
        throw boom.notFound(`Person with id: ${id} was not found`);
      }

      res.json({
        deleted: true,
        data: {
          person: deletedPerson
        }
      });
      return;
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        throw boom.badRequest('Id is malformed');
      }

      throw error;
    }
  })
);

/**********************************************************************************************************************
* Records Routes
/********************************************************************************************************************/

app.post('/api/v1/records',
  handleAsyncErrors(async (req, res) => {
    const record = req.body.data.record;

    const createdRecord = await new RecordModel(record).save();

    res.status(201); // created
    res.json({
      created: true,
      data: {
        record: createdRecord
      }
    });
  })
);

app.get('/api/v1/records',
  // addCacheHeaders(moment.duration({ days: 1 }).asSeconds()),
  handleAsyncErrors(async (req, res) => {
    const {
      personId
    } = req.query;

    const query = RecordModel.find().lean();

    if (personId) {
      query.where('personId').equals(personId);
    }

    const records = await query.exec();

    res.json({
      data: records
    });
  })
);

app.delete('/api/v1/records/:id',
  handleAsyncErrors(async (req, res) => {
    const id = req.params.id;

    try {
      const deletedRecord = await RecordModel.findOneAndRemove({ _id: id });

      if (deletedRecord === null) {
        throw boom.notFound(`Record with id: ${id} was not found`);
      }

      res.json({
        deleted: true,
        data: {
          record: deletedRecord
        }
      });
      return;
    } catch (error) {
      if (error instanceof mongoose.CastError) {
        throw boom.badRequest('Id is malformed');
      }

      throw error;
    }
  })
);

/**********************************************************************************************************************
* Error Handling
/********************************************************************************************************************/

// development error handler
if (env.NODE_ENV === 'development') {
  app.use((err, req, res, next) => {
    if (!err.isBoom) {
      boom.boomify(err);
    }

    res.status(err.output.statusCode || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
app.use((err, req, res, next) => {
  if (!err.isBoom) {
    boom.boomify(err);
  }

  res.status(err.output.statusCode || 500);
  res.json({
    message: err.message,
    error: {} // don't leak stack trace
  });
});

/**********************************************************************************************************************
* Launch
/********************************************************************************************************************/

httpServer.listen(port, () => {
  console.log('Api running on port: ' + port);
});
