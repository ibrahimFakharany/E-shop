const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    // Trigger "remove" event when update document
    if (!document) {
      return next(new AppError(`No document for this id ${id}`, 404));
    }
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(new AppError(`${req.params.id} not found`, 404));
    }
    document.save();
    res.status(200).json({ data: document });
  });

exports.getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (populateOpt) {
      query.populate(populateOpt);
    }
    const document = await query;
    if (!document)
      return next(new AppError(`${req.params.id} not found `, 404));
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const documentsCount = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(
      Model.find(req.filterOptions),
      req.query
    )
      .search()
      .filter()
      .limitFields()
      .pagination(documentsCount)
      .sort();

    const { mongooseQuery, pagination } = apiFeatures;
    const results = await mongooseQuery;

    res.status(200).json({
      pagination: pagination,
      size: results.length,
      data: results,
    });
  });
