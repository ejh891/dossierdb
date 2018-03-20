const PersonModel = require('../models/persons');
const RecordCollection = require('./recordCollection');

class PersonCollection {
  static async browse() {
    const persons = await PersonModel.find({}).lean();

    const asyncPopulates = [];
    for (const person of persons) {
      asyncPopulates.push((async () => await PersonCollection.populate(person))());
    }

    return await Promise.all(asyncPopulates);
  }

  static async read(id) {
    const person = await PersonModel.findOne({ _id: id }).lean();

    return await PersonCollection.populate(person);
  }

  static async edit(id, person) {
    const updatedPerson = await PersonModel.findOneAndUpdate(
      { _id: id },
      person,
      { new: true } // return the updated doc instead of the original doc
    ).lean();

    return await PersonCollection.populate(updatedPerson);
  }

  static async add(person) {
    const newPerson = await new PersonModel(person).save();

    return await PersonCollection.populate(newPerson.toObject());
  }

  static async delete(id) {
    const deletedPerson = await PersonModel.findOneAndRemove({ _id: id }).lean();

    return await PersonCollection.populate(deletedPerson);
  }

  static async populate(person) {
    person.records = await RecordCollection.browse({ personId: person._id });

    return person;
  }
}

module.exports = PersonCollection;
