class APIFeatures {

    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fileds'];
      excludedFields.forEach(el => delete queryObj[el])
  
      let queryString = JSON.stringify(queryObj);
      queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
      this.query = this.query.find(JSON.parse(queryString));
      return this;
  
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.split(',').join(' ');
        this.query = query.sort(sortBy)
      } else {
        this.query = this.query.sort('-createdAt')
      }
  
      return this;
    }
  
    // limitFields() {
    //   if (this.queryString.fields) {
    //     const fields = this.queryString.fields.split(',').join(' ');       
    //     console.log(fields);
    //     this.query = this.query.select(fields);
    //   } else {
    //     this.query = query.select('-__v')
    //   }
  
    //   return this;
    // }
  
    pagination() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryStringlimit * 1 || 2;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  
  }
module.exports = APIFeatures;  