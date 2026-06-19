const Property = require('../models/Property');

const getAllProperties = async (req, res) => {
  const { city, minPrice, maxPrice } = req.query;
  const filter = {};

  if (city) {
    filter.city = city;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  const properties = await Property.find(filter).sort({ createdAt: -1 });

  return res.status(200).json(properties);
};

const getMyProperties = async (req, res) => {
  const properties = await Property.find({ author: req.user.id }).sort({ createdAt: -1 });

  return res.status(200).json(properties);
};

const createProperty = async (req, res) => {
  const { title, description, price, city, country, type, imageUrls } = req.body;

  if (!title || !description || price === undefined || !city || !country) {
    return res.status(400).json({
      message: 'Title, description, price, city, and country are required',
    });
  }

  const property = await Property.create({
    title,
    description,
    price,
    city,
    country,
    type,
    imageUrls,
    author: req.user.id,
  });

  return res.status(201).json(property);
};

const updateProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }

  if (property.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { title, description, price, city, country, type, imageUrls } = req.body;

  if (title !== undefined) property.title = title;
  if (description !== undefined) property.description = description;
  if (price !== undefined) property.price = price;
  if (city !== undefined) property.city = city;
  if (country !== undefined) property.country = country;
  if (type !== undefined) property.type = type;
  if (imageUrls !== undefined) property.imageUrls = imageUrls;

  await property.save();

  return res.status(200).json(property);
};

const deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }

  if (property.author.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await property.deleteOne();

  return res.status(200).json({ message: 'Property deleted' });
};

module.exports = {
  getAllProperties,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
};
