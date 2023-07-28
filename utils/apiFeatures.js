class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const filteration = { ...this.queryString };
    const fieldsToRemove = ["page", "limit", "fields", "sort", "keyword"];
    fieldsToRemove.forEach((e) => delete filteration[e]);
    let filterationStr = JSON.stringify(filteration);
    filterationStr = filterationStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(filterationStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.mongooseQuery.sort(this.queryString.sort.split(",").join(" "));
    } else {
      this.mongooseQuery.sort("-createAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.mongooseQuery = this.mongooseQuery.select(
        this.queryString.fields.split(",").join(" ")
      );
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  pagination(documentsCount) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const pagination = {};
    pagination.page = page;
    pagination.limit = limit;
    pagination.totalPages = Math.ceil(documentsCount / limit);

    const endIndex = page * limit;
    if (endIndex < documentsCount) pagination.nextPage = page + 1;
    if (skip > 0) pagination.prevPage = page - 1;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.pagination = pagination;
    return this;
  }

  search(modelName) {
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === "Products")
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      else {
        query = {
          name: { $regex: this.queryString.keyword, $options: "i" },
        };
      }

      this.mongooseQuery.find(query);
    }
    return this;
  }
}
module.exports = ApiFeatures;
