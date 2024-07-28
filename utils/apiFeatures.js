class APIFeatures {
  // mongoQuery will be the field we will use to build the mongo query
  mongoQuery = '';
  //   request query is the query that comes from the req query, in the API String
  requestQuery = '';
  constructor(mongoQuery, requestQuery) {
    this.mongoQuery = mongoQuery;
    this.requestQuery = requestQuery;
  }

  filter() {
    // spread out the query object from the request
    const queryObj = { ...this.requestQuery };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.map((curField) => delete queryObj[curField]);

    let queryString = JSON.stringify(queryObj);
    // regex to replace
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.mongoQuery.find(JSON.parse(queryString));

    // since we're chaining the features one after the other, we have to return the this object.
    return this;
  }

  sort() {
    if (this.requestQuery.sort) {
      const sortBy = this.requestQuery?.sort.split(',').join(' ');
      this.mongoQuery = this.mongoQuery.sort(sortBy);
    } else {
      this.mongoQuery = this.mongoQuery.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // field limiting

    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      console.log({ fields });
      this.mongoQuery = this.mongoQuery.select(fields);
    } else {
      // removing internal field __v included by mongoDB
      this.mongoQuery.select('-__v');
    }

    return this;
  }

  paginate() {
    // convert string to number for page
    const page = this.requestQuery.page * 1 || 1;
    const limit = this.requestQuery.limit * 1 || 100;

    const skip = (page - 1) * limit;

    this.mongoQuery = this.mongoQuery.skip(skip).limit(limit);

    // since we're chaining the features one after the other, we have to return the this object.
    return this;
  }
}

module.exports = APIFeatures;
