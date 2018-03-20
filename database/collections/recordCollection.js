const RecordModel = require('../models/records');

class RecordCollection {
  static async browse(options = {}) {
    const {
      personId
    } = options;

    const query = RecordModel.find().lean();

    if (personId) {
      query.where('personId').equals(personId);
    }

    const records = await query.exec();

    const asyncPopulates = [];
    for (const record of records) {
      asyncPopulates.push((async () => await RecordCollection.populate(record))());
    }

    return await Promise.all(asyncPopulates);
  }

  static async read(id) {
    const record = await RecordModel.findOne({ _id: id }).lean();

    return await RecordCollection.populate(record);
  }

  static async edit(id, record) {
    const updatedRecord = await RecordModel.findOneAndUpdate(
      { _id: id },
      record,
      { new: true } // return the updated doc instead of the original doc
    ).lean();

    return await RecordCollection.populate(updatedRecord);
  }

  static async add(record) {
    const newRecord = await new RecordModel(record).save();

    return await RecordCollection.populate(newRecord.toObject());
  }

  static async delete(id) {
    const deletedRecord = await RecordModel.findOneAndRemove({ _id: id }).lean();

    return await RecordCollection.populate(deletedRecord);
  }

  static async populate(record) {
    // nothing to populate for now
    return record;
  }
}

module.exports = RecordCollection;
